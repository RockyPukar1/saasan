import { InjectModel } from '@nestjs/mongoose';
import {
  AuthSessionDocument,
  AuthSessionEntity,
  RevokeSessionReason,
} from '../entities/auth-session.entity';
import { Model, Types } from 'mongoose';
import { CreateAuthSessionDto } from '../dtos/create-auth-session.dto';
import { SessionIdDto } from '../dtos/session-id.dto';
import { UserIdDto } from 'src/user/dtos/user-id.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthSessionRepository {
  constructor(
    @InjectModel(AuthSessionEntity.name)
    private readonly model: Model<AuthSessionDocument>,
  ) {}

  async create(createAuthSessionDto: CreateAuthSessionDto) {
    return await this.model.create(createAuthSessionDto);
  }

  async findById({ sessionId }: SessionIdDto) {
    return await this.model.findById(sessionId);
  }

  async findActiveByUserId({ userId }: UserIdDto) {
    return this.model
      .find({
        userId: new Types.ObjectId(userId),
        isActive: true,
        revokedAt: null,
      })
      .sort({ createdAt: -1 });
  }

  async findActiveSessionById({ sessionId }: SessionIdDto) {
    return this.model.findOne({
      _id: new Types.ObjectId(sessionId),
      isActive: true,
      revokedAt: null,
    });
  }

  async updateLastUsed({ sessionId }: SessionIdDto) {
    await this.model.updateOne(
      { _id: new Types.ObjectId(sessionId) },
      {
        $set: {
          lastUsedAt: new Date(),
        },
      },
    );
  }

  async revokeSession(
    { sessionId }: SessionIdDto,
    reason: RevokeSessionReason = RevokeSessionReason.MANUAL_LOGOUT,
  ) {
    await this.model.updateOne(
      { _id: new Types.ObjectId(sessionId) },
      {
        $set: {
          isActive: false,
          revokedAt: new Date(),
          revokedReason: reason,
        },
      },
    );
  }

  async revokeAllUserSessionsExceptCurrent(
    { userId }: UserIdDto,
    { sessionId }: SessionIdDto,
    reason: RevokeSessionReason = RevokeSessionReason.REVOKE_ALL_EXCEPT_CURRENT,
  ) {
    await this.model.updateMany(
      {
        userId: new Types.ObjectId(userId),
        _id: { $ne: new Types.ObjectId(sessionId) },
        isActive: true,
        revokedAt: null,
      },
      {
        $set: {
          isActive: false,
          revokedAt: new Date(),
          revokedReason: reason,
        },
      },
    );
  }

  async revokeAllUserSessions(
    { userId }: UserIdDto,
    reason: RevokeSessionReason = RevokeSessionReason.REVOKE_ALL_SESSIONS,
  ) {
    await this.model.updateMany(
      {
        userId: new Types.ObjectId(userId),
        isActive: true,
        revokedAt: null,
      },
      {
        $set: {
          isActive: false,
          revokedAt: new Date(),
          revokedReason: reason,
        },
      },
    );
  }

  async findAllByUserId({ userId }: UserIdDto) {
    return await this.model
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 });
  }
}
