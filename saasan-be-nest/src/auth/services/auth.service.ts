import { Global, HttpStatus, Injectable } from '@nestjs/common';
import bcrypt from 'bcryptjs';
import { UserRepository } from 'src/user/repositories/user.repository';
import { RegisterUserDto } from '../dtos/register.dto';
import { PASSWORD_SALT } from 'src/user/entities/user.entity';
import { LoginUserDto } from '../dtos/login.dto';
import { GlobalHttpException } from 'src/common/exceptions/global-http.exception';
import { ResponseHelper } from 'src/common/helpers/response.helper';
import { AuthHelper } from 'src/common/helpers/auth.helper';
import { RedisCacheService } from 'src/common/cache/services/redis-cache.service';
import { AuthSessionRepository } from '../repositories/auth-session.repository';
import { UserMetaDto } from '../dtos/user-meta.dto';
import { RefreshTokenDto } from '../dtos/refresh-token.dto';
import { SessionIdDto } from '../dtos/session-id.dto';
import { RevokeSessionReason } from '../entities/auth-session.entity';
import { UserIdDto } from 'src/user/dtos/user-id.dto';
import { Types } from 'mongoose';
import { AuthSessionSerializer } from '../serializers/auth-session.serializer';
import { PermissionHelper } from 'src/common/helpers/permission.helper';
import { RolePermissionService } from '../../role-permission/services/role-permission.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly redisCache: RedisCacheService,
    private readonly authSessionRepo: AuthSessionRepository,
    private readonly rolePermissionService: RolePermissionService,
  ) {}

  async register(userData: RegisterUserDto, meta?: UserMetaDto) {
    const doesUserExists = await this.doesUserExists({
      email: userData.email,
    }).lean();
    if (doesUserExists) {
      throw new GlobalHttpException(
        'userAlreadyExistsWithEmail',
        HttpStatus.AMBIGUOUS,
      );
    }

    const hashedPassword = await bcrypt.hash(userData.password, PASSWORD_SALT);
    userData.password = hashedPassword;

    const user = await this.userRepo.create(userData);

    this.userRepo.updateLastActive(user._id.toString());
    await this.redisCache.del('users:*');

    const permissions = await this.rolePermissionService.getPermissionsByRole(
      user.role,
    );
    const nestedPermissions = PermissionHelper.toNestedPermissions(
      permissions.permissions,
    );

    const tokens = await this.createSessionAndTokens(user, {
      ipAddress: meta?.ipAddress,
      userAgent: meta?.userAgent,
    });

    return ResponseHelper.success(
      {
        user,
        permissions: permissions.permissions,
        nestedPermissions,
        ...tokens,
      },
      'User registered successfully',
    );
  }

  async login({ email, password }: LoginUserDto, meta?: UserMetaDto) {
    const user = await this.doesUserExists({ email }).lean();
    if (!user) {
      throw new GlobalHttpException('user404', HttpStatus.NOT_FOUND);
    }

    const isValidPassword = await AuthHelper.comparePassword(
      password,
      user.password || '',
    );
    if (!isValidPassword) {
      throw new GlobalHttpException('invalidCredentials', HttpStatus.NOT_FOUND);
    }

    this.userRepo.updateLastActive(user._id.toString());

    const permissions = await this.rolePermissionService.getPermissionsByRole(
      user.role,
    );
    const nestedPermissions = PermissionHelper.toNestedPermissions(
      permissions.permissions,
    );

    const tokens = await this.createSessionAndTokens(user, {
      ipAddress: meta?.ipAddress,
      userAgent: meta?.userAgent,
    });

    return ResponseHelper.success(
      {
        user,
        permissions: permissions.permissions,
        nestedPermissions,
        ...tokens,
      },
      'User logged in successfully',
    );
  }

  async refreshToken({ refreshToken }: RefreshTokenDto, meta?: UserMetaDto) {
    let payload: any;

    try {
      payload = AuthHelper.verifyRefreshToken(refreshToken);
    } catch (error) {
      throw new GlobalHttpException(
        'invalidCredentials',
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (payload?.type !== 'refresh') {
      throw new GlobalHttpException(
        'invalidCredentials',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const session = await this.authSessionRepo.findById({
      sessionId: payload.sessionId,
    });

    if (!session) {
      throw new GlobalHttpException(
        'invalidCredentials',
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (!session.isActive || session.revokedAt) {
      throw new GlobalHttpException(
        'invalidCredentials',
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (new Date(session.refreshExpiresAt).getTime() < Date.now()) {
      throw new GlobalHttpException(
        'invalidCredentials',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const incomingRefreshTokenHash = AuthHelper.hashToken(refreshToken);

    if (incomingRefreshTokenHash !== session.refreshTokenHash) {
      await this.authSessionRepo.revokeSession(
        { sessionId: session._id.toString() },
        RevokeSessionReason.REFRESH_TOKEN_MISMATCH,
      );
      throw new GlobalHttpException(
        'invalidCredentials',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const user = await this.doesUserExists({
      _id: session.userId,
    }).lean();

    if (!user) {
      throw new GlobalHttpException('user404', HttpStatus.NOT_FOUND);
    }

    await this.authSessionRepo.revokeSession(
      { sessionId: session._id.toString() },
      RevokeSessionReason.REFRESH_TOKEN_ROTATED,
    );

    const tokens = await this.createSessionAndTokens(user, {
      ipAddress: session.ipAddress,
      userAgent: session.userAgent,
    });

    await this.userRepo.updateLastActive(user._id.toString());

    const permissions = await this.rolePermissionService.getPermissionsByRole(
      user.role,
    );
    const nestedPermissions = PermissionHelper.toNestedPermissions(
      permissions.permissions,
    );

    return ResponseHelper.success(
      {
        user,
        permissions: permissions.permissions,
        nestedPermissions,
        ...tokens,
      },
      'Token refreshed successfully',
    );
  }

  private async createSessionAndTokens(user, meta: UserMetaDto) {
    const refreshExpiresAt = AuthHelper.getRefreshTokenExpiryDate();

    const session = await this.authSessionRepo.create({
      userId: user._id.toString(),
      refreshTokenHash: 'temporary',
      refreshExpiresAt,
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
    });
    const accessToken = AuthHelper.generateToken({
      _id: user._id.toString(),
      email: user.email,
      role: user.role,
      sessionId: session._id.toString(),
    });
    const refreshToken = AuthHelper.generateRefreshToken({
      userId: user._id.toString(),
      sessionId: session._id.toString(),
    });

    const refreshTokenHash = AuthHelper.hashToken(refreshToken);

    session.refreshTokenHash = refreshTokenHash;
    session.lastUsedAt = new Date();
    await session.save();

    return {
      accessToken,
      refreshToken,
      sessionId: session._id.toString(),
      accessTokenExpiresIn: 15 * 60,
      refreshTokenExpiresIn: refreshExpiresAt,
    };
  }

  async logoutCurrentSession(sessionIdDto: SessionIdDto) {
    const session = await this.authSessionRepo.findById(sessionIdDto);

    if (!session)
      throw new GlobalHttpException(
        'invalidCredentials',
        HttpStatus.UNAUTHORIZED,
      );

    if (!session.isActive || session.revokedAt)
      throw new GlobalHttpException(
        'invalidCredentials',
        HttpStatus.UNAUTHORIZED,
      );

    await this.authSessionRepo.revokeSession(
      sessionIdDto,
      RevokeSessionReason.MANUAL_LOGOUT,
    );
  }

  async getMySessions(userIdDto: UserIdDto) {
    const user = await this.doesUserExists({
      _id: new Types.ObjectId(userIdDto.userId),
    });

    if (!user) throw new GlobalHttpException('user404', HttpStatus.NOT_FOUND);

    const sessions = await this.authSessionRepo.findActiveByUserId(userIdDto);

    return ResponseHelper.response(
      AuthSessionSerializer,
      sessions,
      'Sessions fetched successfully',
    );
  }

  async revokeAllMySessions(userIdDto: UserIdDto, sessionIdDto?: SessionIdDto) {
    if (sessionIdDto) {
      return this.authSessionRepo.revokeAllUserSessionsExceptCurrent(
        userIdDto,
        sessionIdDto,
        RevokeSessionReason.REVOKE_ALL_EXCEPT_CURRENT,
      );
    } else {
      await this.authSessionRepo.revokeAllUserSessions(
        userIdDto,
        RevokeSessionReason.REVOKE_ALL_SESSIONS,
      );
    }
  }

  private doesUserExists(filter: any) {
    return this.userRepo.findOne(filter);
  }
}
