import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import bcrypt from 'bcryptjs';
import { Types } from 'mongoose';
import { AuthSessionRepository } from 'src/auth/repositories/auth-session.repository';
import { RevokeSessionReason } from 'src/auth/entities/auth-session.entity';
import { RedisCacheService } from 'src/common/cache/services/redis-cache.service';
import { GlobalHttpException } from 'src/common/exceptions/global-http.exception';
import { PermissionHelper } from 'src/common/helpers/permission.helper';
import { ResponseHelper } from 'src/common/helpers/response.helper';
import { RolePermissionService } from 'src/role-permission/services/role-permission.service';
import { ChangeCurrentPasswordDto } from '../dtos/change-current-password.dto';
import { DeleteAccountDto } from '../dtos/delete-account.dto';
import { UpdatePoliticianPreferencesDto } from '../dtos/update-politician-preferences.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { UserIdDto } from '../dtos/user-id.dto';
import { PASSWORD_SALT, UserRole } from '../entities/user.entity';
import { AdminRepository } from '../repositories/admin.repository';
import { CitizenRepository } from '../repositories/citizen.repository';
import { UserRepository } from '../repositories/user.repository';
import {
  UserProfilePayloadSerializer,
  UserSerializer,
} from '../serializers/user.serializer';
import { PoliticianRepository } from 'src/politics/politician/repositories/politician.repository';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private readonly userRepo: UserRepository,
    private readonly redisCache: RedisCacheService,
    private readonly rolePermissionService: RolePermissionService,
    private readonly citizenRepo: CitizenRepository,
    private readonly adminRepo: AdminRepository,
    private readonly politicianRepo: PoliticianRepository,
    private readonly authSessionRepo: AuthSessionRepository,
  ) {}

  async getProfile({ userId }: UserIdDto) {
    const user = await this.doesUserExists({
      _id: new Types.ObjectId(userId),
    }).lean();
    if (!user) {
      throw new GlobalHttpException('user404', HttpStatus.NOT_FOUND);
    }

    const permissions = await this.rolePermissionService.getPermissionsByRole(
      user.role,
    );
    const nestedPermissions = PermissionHelper.toNestedPermissions(
      permissions.permissions,
    );
    const profile = await this.getRoleProfile(user);

    return ResponseHelper.response(
      UserProfilePayloadSerializer,
      {
        user: UserSerializer.toPayload(user, profile),
        profile,
        permissions: permissions.permissions,
        nestedPermissions,
      },
      'User Profile fetched successfully',
    );
  }

  async updateProfile(userIdDto: UserIdDto, updateData: UpdateUserDto) {
    const existingUser = await this.userRepo.findById(userIdDto);
    if (!existingUser)
      throw new GlobalHttpException('user404', HttpStatus.NOT_FOUND);

    const authUpdate = await this.pickSelfAuthUpdate(
      existingUser._id.toString(),
      updateData,
    );
    const user =
      Object.keys(authUpdate).length > 0
        ? await this.userRepo.findByIdAndUpdate(userIdDto, authUpdate)
        : existingUser;

    const profile = await this.updateRoleProfile(
      userIdDto,
      existingUser.role,
      this.pickProfileUpdate(updateData),
    );

    return ResponseHelper.response(
      UserProfilePayloadSerializer,
      { user: UserSerializer.toPayload(user, profile), profile },
      'User Profile updated successfully',
    );
  }

  async updateUser(userIdDto: UserIdDto, updateData: UpdateUserDto) {
    const existingUser = await this.userRepo.findById(userIdDto);
    if (!existingUser)
      throw new GlobalHttpException('user404', HttpStatus.NOT_FOUND);

    const authUpdate: Record<string, unknown> = {};
    if (updateData.email) {
      authUpdate.email = await this.validateEmailForUpdate(
        existingUser._id.toString(),
        updateData.email,
      );
    }
    if (typeof updateData.isActive === 'boolean') {
      authUpdate.isActive = updateData.isActive;
    }
    if (typeof updateData.isVerified === 'boolean') {
      authUpdate.isVerified = updateData.isVerified;
    }

    const user =
      Object.keys(authUpdate).length > 0
        ? await this.userRepo.findByIdAndUpdate(userIdDto, authUpdate)
        : existingUser;

    const profile = await this.updateRoleProfile(
      userIdDto,
      existingUser.role,
      this.pickProfileUpdate(updateData),
    );

    await this.redisCache.del('users:*');

    return ResponseHelper.response(
      UserSerializer,
      UserSerializer.toPayload(user, profile),
      'User updated successfully',
    );
  }

  async updatePoliticianPreferences(
    userIdDto: UserIdDto,
    preferences: UpdatePoliticianPreferencesDto,
  ) {
    const user = await this.userRepo.findById(userIdDto);
    if (!user) throw new GlobalHttpException('user404', HttpStatus.NOT_FOUND);
    if (user.role !== UserRole.POLITICIAN) {
      throw new GlobalHttpException('permission403', HttpStatus.FORBIDDEN);
    }

    const profile = await this.updateRoleProfile(userIdDto, user.role, {
      preferences,
    });

    return ResponseHelper.response(
      UserProfilePayloadSerializer,
      { user: UserSerializer.toPayload(user, profile), profile },
      'Settings updated successfully',
    );
  }

  async changeMyPassword(
    userIdDto: UserIdDto,
    currentSessionId: string | undefined,
    { currentPassword, newPassword }: ChangeCurrentPasswordDto,
  ) {
    const user = await this.userRepo.findById(userIdDto);
    if (!user) throw new GlobalHttpException('user404', HttpStatus.NOT_FOUND);

    const isValidPassword = await bcrypt.compare(
      currentPassword,
      user.password || '',
    );
    if (!isValidPassword) {
      throw new GlobalHttpException(
        'invalidCredentials',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const password = await bcrypt.hash(newPassword, PASSWORD_SALT);
    await this.userRepo.findByIdAndUpdate(userIdDto, { password });
    if (currentSessionId) {
      await this.authSessionRepo.revokeAllUserSessionsExceptCurrent(
        userIdDto,
        { sessionId: currentSessionId },
        RevokeSessionReason.REVOKE_ALL_EXCEPT_CURRENT,
      );
    } else {
      await this.authSessionRepo.revokeAllUserSessions(
        userIdDto,
        RevokeSessionReason.REVOKE_ALL_SESSIONS,
      );
    }

    return ResponseHelper.success(
      null,
      'Password updated successfully. Other sessions have been signed out.',
    );
  }

  async exportMyData(userIdDto: UserIdDto) {
    const user = await this.doesUserExists({
      _id: new Types.ObjectId(userIdDto.userId),
    }).lean();
    if (!user) throw new GlobalHttpException('user404', HttpStatus.NOT_FOUND);

    const profile = await this.getRoleProfile(user);
    const sessions = await this.authSessionRepo.findAllByUserId(userIdDto);
    const permissions = await this.rolePermissionService.getPermissionsByRole(
      user.role,
    );

    let announcements: any[] = [];
    if (user.role === UserRole.POLITICIAN && profile?._id) {
      announcements = await this.politicianRepo.getAnnouncementsByPoliticianId(
        profile._id.toString(),
      );
    }

    return ResponseHelper.success(
      {
        exportedAt: new Date().toISOString(),
        user: UserSerializer.toPayload(user, profile),
        profile,
        permissions: permissions.permissions,
        sessions,
        announcements,
      },
      'Account export generated successfully',
    );
  }

  async deleteMyAccount(
    userIdDto: UserIdDto,
    { currentPassword }: DeleteAccountDto,
  ) {
    const user = await this.userRepo.findById(userIdDto);
    if (!user) throw new GlobalHttpException('user404', HttpStatus.NOT_FOUND);

    const isValidPassword = await bcrypt.compare(
      currentPassword,
      user.password || '',
    );
    if (!isValidPassword) {
      throw new GlobalHttpException(
        'invalidCredentials',
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (user.role === UserRole.POLITICIAN) {
      const politician = await this.politicianRepo.findByUserId(userIdDto.userId);
      if (politician?._id) {
        await this.politicianRepo.deleteAnnouncementsByPoliticianId(
          politician._id.toString(),
        );
        await this.politicianRepo.findByIdAndUpdate(politician._id.toString(), {
          $unset: { userId: '' },
        });
      }
    } else {
      await this.deleteRoleProfile(userIdDto, user.role);
    }

    await this.authSessionRepo.revokeAllUserSessions(
      userIdDto,
      RevokeSessionReason.MANUAL_LOGOUT,
    );
    await this.userRepo.deleteOne(userIdDto);
    await this.redisCache.del('users:*');

    return ResponseHelper.success(
      null,
      'Account deleted successfully. Public politician records remain intact.',
    );
  }

  async getAllUsers({ page = 1, limit = 10 }) {
    const cacheKey = `users:${page}:${limit}`;

    const cached = await this.redisCache.get(cacheKey);

    if (cached) {
      if (
        cached &&
        typeof cached === 'object' &&
        'data' in cached &&
        Array.isArray((cached as any).data)
      ) {
        (cached as any).data = await this.attachProfiles((cached as any).data);
      }

      return ResponseHelper.response(
        UserSerializer,
        cached,
        'Users fetched successfully from cache',
      );
    }
    const users = await this.userRepo.findAll({ page, limit });
    users.data = await this.attachProfiles(users.data);

    this.redisCache.set(cacheKey, users);

    return ResponseHelper.response(
      UserSerializer,
      users,
      'Users fetched successfully',
    );
  }

  async getUserById({ userId }: UserIdDto) {
    const user = await this.doesUserExists({
      _id: new Types.ObjectId(userId),
    }).lean();
    if (!user) throw new GlobalHttpException('user404', HttpStatus.NOT_FOUND);
    const profile = await this.getRoleProfile(user);

    return ResponseHelper.response(
      UserSerializer,
      UserSerializer.toPayload(user, profile),
      'User fetched successfully',
    );
  }

  async deleteUser(userIdDto: UserIdDto) {
    const user = await this.doesUserExists({
      _id: new Types.ObjectId(userIdDto.userId),
    });
    if (!user) throw new GlobalHttpException('user404', HttpStatus.NOT_FOUND);

    await this.deleteRoleProfile(userIdDto, user.role);
    await this.userRepo.deleteOne(userIdDto);

    this.redisCache.del('users:*');
  }

  private doesUserExists(filter: any) {
    return this.userRepo.findOne(filter);
  }

  private async attachProfiles(users: any[]) {
    return Promise.all(
      users.map(async (user) => {
        const plain =
          typeof user.toObject === 'function' ? user.toObject() : user;
        const profile = await this.getRoleProfile(user);
        return UserSerializer.toPayload(plain, profile);
      }),
    );
  }

  private async getRoleProfile(user: any) {
    const userId = user._id?.toString();
    if (!userId) return null;

    if (user.role === UserRole.CITIZEN) {
      return this.citizenRepo.findByUserId({ userId }).lean();
    }

    if (user.role === UserRole.ADMIN) {
      return this.adminRepo.findByUserId({ userId }).lean();
    }

    if (user.role === UserRole.POLITICIAN) {
      return this.politicianRepo.findByUserId(userId);
    }

    return null;
  }

  private async updateRoleProfile(
    { userId }: UserIdDto,
    role: UserRole,
    updateData: Record<string, unknown>,
  ) {
    if (role === UserRole.CITIZEN) {
      return this.citizenRepo.findByUserIdAndUpdate({ userId }, updateData);
    }

    if (role === UserRole.ADMIN) {
      return this.adminRepo.findByUserIdAndUpdate({ userId }, updateData);
    }

    if (role === UserRole.POLITICIAN) {
      const politician = await this.politicianRepo.findByUserId(userId);
      if (!politician?._id) return null;

      await this.politicianRepo.findByIdAndUpdate(
        politician._id.toString(),
        updateData,
      );
      return this.politicianRepo.findByUserId(userId);
    }

    return null;
  }

  private async deleteRoleProfile({ userId }: UserIdDto, role: UserRole) {
    if (role === UserRole.CITIZEN) {
      await this.citizenRepo.deleteByUserId({ userId });
      return;
    }

    if (role === UserRole.ADMIN) {
      await this.adminRepo.deleteByUserId({ userId });
      return;
    }

    if (role === UserRole.POLITICIAN) {
      const politician = await this.politicianRepo.findByUserId(userId);
      if (politician?._id) {
        await this.politicianRepo.findByIdAndUpdate(politician._id.toString(), {
          $unset: { userId: '' },
        });
      }
    }
  }

  private pickProfileUpdate(updateData: UpdateUserDto) {
    const { email, role, isActive, isVerified, ...profileUpdate } = updateData;

    void email;
    void role;
    void isActive;
    void isVerified;

    return profileUpdate;
  }

  private async pickSelfAuthUpdate(
    userId: string,
    updateData: UpdateUserDto,
  ): Promise<Record<string, unknown>> {
    const authUpdate: Record<string, unknown> = {};

    if (updateData.email) {
      authUpdate.email = await this.validateEmailForUpdate(
        userId,
        updateData.email,
      );
    }

    return authUpdate;
  }

  private async validateEmailForUpdate(userId: string, email: string) {
    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await this.userRepo.findOne({ email: normalizedEmail });

    if (existingUser && existingUser._id.toString() !== userId) {
      throw new GlobalHttpException(
        'userAlreadyExistsWithEmail',
        HttpStatus.AMBIGUOUS,
      );
    }

    return normalizedEmail;
  }
}
