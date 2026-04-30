import { HttpStatus, Injectable } from '@nestjs/common';
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
import { PoliticianRepository } from 'src/politics/politician/repositories/politician.repository';
import { UserRole } from 'src/user/entities/user.entity';
import { CitizenRepository } from 'src/user/repositories/citizen.repository';
import { AdminRepository } from 'src/user/repositories/admin.repository';
import { UserSerializer } from 'src/user/serializers/user.serializer';
import { AuthPayloadSerializer } from '../serializers/auth-payload.serializer';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly redisCache: RedisCacheService,
    private readonly authSessionRepo: AuthSessionRepository,
    private readonly rolePermissionService: RolePermissionService,
    private readonly politicianRepo: PoliticianRepository,
    private readonly citizenRepo: CitizenRepository,
    private readonly adminRepo: AdminRepository,
  ) {}

  async registerCitizen(userData: RegisterUserDto, meta?: UserMetaDto) {
    return this.register(userData, UserRole.CITIZEN, meta);
  }

  async register(
    userData: RegisterUserDto,
    role: UserRole = UserRole.CITIZEN,
    meta?: UserMetaDto,
  ) {
    const email = userData.email.trim().toLowerCase();
    const doesUserExists = await this.doesUserExists({
      email,
    }).lean();
    if (doesUserExists) {
      throw new GlobalHttpException(
        'userAlreadyExistsWithEmail',
        HttpStatus.AMBIGUOUS,
      );
    }

    const hashedPassword = await bcrypt.hash(userData.password, PASSWORD_SALT);
    const {
      fullName,
      provinceId,
      districtId,
      constituencyId,
      municipalityId,
      wardId,
    } = userData;

    const user = await this.userRepo.create({
      email,
      password: hashedPassword,
      role,
    });

    if (role === UserRole.CITIZEN) {
      await this.citizenRepo.create({
        userId: user._id,
        fullName,
        provinceId: new Types.ObjectId(provinceId),
        districtId: new Types.ObjectId(districtId),
        constituencyId: new Types.ObjectId(constituencyId),
        municipalityId: new Types.ObjectId(municipalityId),
        wardId: new Types.ObjectId(wardId),
      });
    }

    this.userRepo.updateLastActive(user._id.toString());
    await this.redisCache.del('users:*');

    return this.buildAuthResponse(user, meta, 'User registered successfully');
  }

  async login({ email, password }: LoginUserDto, meta?: UserMetaDto) {
    return this.loginForRole({ email, password }, meta);
  }

  async loginAdmin(loginData: LoginUserDto, meta?: UserMetaDto) {
    return this.loginForRole(loginData, meta, UserRole.ADMIN);
  }

  async loginCitizen(loginData: LoginUserDto, meta?: UserMetaDto) {
    return this.loginForRole(loginData, meta, UserRole.CITIZEN);
  }

  async loginPolitician({ email, password }: LoginUserDto, meta?: UserMetaDto) {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await this.userRepo.findOne({ email: normalizedEmail }).lean();
    if (!user || user.role !== UserRole.POLITICIAN)
      throw new GlobalHttpException('invalidCredentials', HttpStatus.NOT_FOUND);

    const isValidPassword = await AuthHelper.comparePassword(
      password,
      user.password || '',
    );
    if (!isValidPassword)
      throw new GlobalHttpException('invalidCredentials', HttpStatus.NOT_FOUND);

    const politician = await this.politicianRepo
      .findOne({ userId: new Types.ObjectId(user._id.toString()) })
      .lean();
    if (!politician)
      throw new GlobalHttpException('invalidCredentials', HttpStatus.NOT_FOUND);

    await this.userRepo.updateLastActive(user._id.toString());

    return this.buildAuthResponse(
      { ...user, politicianId: politician._id.toString() },
      meta,
      'User logged in successfully',
    );
  }

  private async loginForRole(
    { email, password }: LoginUserDto,
    meta?: UserMetaDto,
    role?: UserRole,
  ) {
    const user = await this.doesUserExists({
      email: email.trim().toLowerCase(),
    }).lean();
    if (!user) {
      throw new GlobalHttpException('user404', HttpStatus.NOT_FOUND);
    }

    if (role && user.role !== role) {
      throw new GlobalHttpException('invalidCredentials', HttpStatus.NOT_FOUND);
    }

    const isValidPassword = await AuthHelper.comparePassword(
      password,
      user.password || '',
    );
    if (!isValidPassword) {
      throw new GlobalHttpException('invalidCredentials', HttpStatus.NOT_FOUND);
    }

    this.userRepo.updateLastActive(user._id.toString());
    return this.buildAuthResponse(user, meta, 'User logged in successfully');
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

    await this.userRepo.updateLastActive(user._id.toString());

    return this.buildAuthResponse(
      user,
      {
        ipAddress: meta?.ipAddress || session.ipAddress,
        userAgent: meta?.userAgent || session.userAgent,
      },
      'Token refreshed successfully',
    );
  }

  private async buildAuthResponse(
    user: any,
    meta?: UserMetaDto,
    message = 'Success',
  ) {
    const { authUser, profile } = await this.withRoleContext(user);
    const permissions = await this.rolePermissionService.getPermissionsByRole(
      authUser.role,
    );
    const nestedPermissions = PermissionHelper.toNestedPermissions(
      permissions.permissions,
    );

    const tokens = await this.createSessionAndTokens(authUser, {
      ipAddress: meta?.ipAddress,
      userAgent: meta?.userAgent,
    });

    return ResponseHelper.response(
      AuthPayloadSerializer,
      {
        user: UserSerializer.toPayload(authUser, profile),
        profile,
        permissions: permissions.permissions,
        nestedPermissions,
        ...tokens,
      },
      message,
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
      politicianId: user.politicianId?.toString?.() || user.politicianId,
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

  private async withRoleContext(user: any) {
    const authUser =
      typeof user.toObject === 'function' ? user.toObject() : { ...user };
    const userId = authUser._id?.toString();
    if (!userId) return { authUser, profile: null };

    if (authUser.role === UserRole.CITIZEN) {
      const profile = await this.citizenRepo.findByUserId({ userId }).lean();
      return { authUser, profile };
    }

    if (authUser.role === UserRole.ADMIN) {
      const profile = await this.adminRepo.findByUserId({ userId }).lean();
      return { authUser, profile };
    }

    if (authUser.role === UserRole.POLITICIAN) {
      const profile = await this.politicianRepo.findByUserId(userId);
      return {
        authUser: {
          ...authUser,
          politicianId:
            authUser.politicianId || profile?._id?.toString?.() || profile?._id,
        },
        profile,
      };
    }

    return { authUser, profile: null };
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

  async revokeMySession(userIdDto: UserIdDto, sessionIdDto: SessionIdDto) {
    const session = await this.authSessionRepo.findById(sessionIdDto);

    if (!session) {
      throw new GlobalHttpException(
        'invalidCredentials',
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (session.userId.toString() !== userIdDto.userId) {
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

    await this.authSessionRepo.revokeSession(
      sessionIdDto,
      RevokeSessionReason.MANUAL_LOGOUT,
    );
  }

  private doesUserExists(filter: any) {
    return this.userRepo.findOne(filter);
  }
}
