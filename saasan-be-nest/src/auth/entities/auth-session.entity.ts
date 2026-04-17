import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { UserEntity } from 'src/user/entities/user.entity';

export enum RevokeSessionReason {
  MANUAL_LOGOUT = 'MANUAL_LOGOUT',
  REVOKE_ALL_EXCEPT_CURRENT = 'REVOKE_ALL_EXCEPT_CURRENT',
  REVOKE_ALL_SESSIONS = 'REVOKE_ALL_SESSIONS',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  REFRESH_TOKEN_ROTATED = 'REFRESH_TOKEN_ROTATED',
  REFRESH_TOKEN_MISMATCH = 'REFRESH_TOKEN_MISMATCH',
}

@Schema({ timestamps: true, collection: AuthSessionEntity.collection })
export class AuthSessionEntity {
  static readonly collection = 'auth_sessions';

  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;

  @Prop({ type: Types.ObjectId, ref: UserEntity.name, required: true })
  userId: Types.ObjectId;

  @Prop({ type: String, required: true })
  refreshTokenHash: string;

  @Prop({ type: Date, required: true })
  refreshExpiresAt: Date;

  @Prop({ type: Date })
  revokedAt?: Date;

  @Prop({ type: String, enum: RevokeSessionReason, default: null })
  revokedReason?: RevokeSessionReason | null;

  @Prop({ type: Date })
  lastUsedAt?: Date;

  @Prop({ type: String })
  ipAddress?: string;

  @Prop({ type: String })
  userAgent?: string;

  @Prop({ type: Boolean, default: true })
  isActive: boolean;
}

export const AuthSessionEntitySchema =
  SchemaFactory.createForClass(AuthSessionEntity);
export type AuthSessionDocument = Document & AuthSessionEntity;
