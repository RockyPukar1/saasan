import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { PermissionEntity } from './permission.entity';

export enum AdminRole {
  SUPER_ADMIN = 'super_admin',
  MODERATOR = 'moderator',
  DATA_STEWARD = 'data_steward',
}

@Schema({ timestamps: true, collection: RoleEntity.collection })
export class RoleEntity {
  static readonly collection = 'roles';
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;

  @Prop({ type: String, required: true, unique: true })
  name: string;

  @Prop({ type: String, required: true })
  description: string;

  @Prop({ type: [Types.ObjectId], ref: PermissionEntity.name, default: [] })
  permissions: Types.ObjectId[];

  @Prop({ type: Boolean, default: true })
  isActive: boolean;

  @Prop({ type: String, enum: AdminRole, unique: true })
  adminRole?: AdminRole;
}

export const RoleEntitySchema = SchemaFactory.createForClass(RoleEntity);
export type RoleEntityDocument = Document & RoleEntity;
