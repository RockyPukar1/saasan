import { Types } from 'mongoose';
import { Injectable, Logger, HttpStatus } from '@nestjs/common';
import { UserRole } from '../entities/user.entity';
import { UserRepository } from '../repositories/user.repository';
import { RedisCacheService } from 'src/common/cache/services/redis-cache.service';
import { ResponseHelper } from 'src/common/helpers/response.helper';
import { GlobalHttpException } from 'src/common/exceptions/global-http.exception';
import { UserIdDto } from '../dtos/user-id.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import {
  UserProfilePayloadSerializer,
  UserSerializer,
} from '../serializers/user.serializer';
import { PermissionHelper } from 'src/common/helpers/permission.helper';
import { RolePermissionService } from 'src/role-permission/services/role-permission.service';
import { CitizenRepository } from '../repositories/citizen.repository';
import { AdminRepository } from '../repositories/admin.repository';
import { InjectModel } from '@nestjs/mongoose';
import {
  PoliticianEntity,
  PoliticianEntityDocument,
} from 'src/politics/politician/entities/politician.entity';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private readonly userRepo: UserRepository,
    private readonly redisCache: RedisCacheService,
    private readonly rolePermissionService: RolePermissionService,
    private readonly citizenRepo: CitizenRepository,
    private readonly adminRepo: AdminRepository,
    @InjectModel(PoliticianEntity.name)
    private readonly politicianModel: Model<PoliticianEntityDocument>,
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
    const user = await this.userRepo.findById(userIdDto);
    if (!user) throw new GlobalHttpException('user404', HttpStatus.NOT_FOUND);

    const profile = await this.updateRoleProfile(
      userIdDto,
      user.role,
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
    if (updateData.email)
      authUpdate.email = updateData.email.trim().toLowerCase();
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
      return this.politicianModel
        .findOne({ userId: new Types.ObjectId(userId) })
        .lean();
    }

    return null;
  }

  private async updateRoleProfile(
    { userId }: UserIdDto,
    role: UserRole,
    updateData: Partial<UpdateUserDto>,
  ) {
    if (role === UserRole.CITIZEN) {
      return this.citizenRepo.findByUserIdAndUpdate({ userId }, updateData);
    }

    if (role === UserRole.ADMIN) {
      return this.adminRepo.findByUserIdAndUpdate({ userId }, updateData);
    }

    if (role === UserRole.POLITICIAN) {
      return this.politicianModel.findOneAndUpdate(
        { userId: new Types.ObjectId(userId) },
        updateData,
        { new: true },
      );
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
      await this.politicianModel.updateOne(
        { userId: new Types.ObjectId(userId) },
        { $unset: { userId: '' } },
      );
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
}
