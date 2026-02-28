import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export enum PermissionAction {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
  MANAGE = 'manage',
}

@Schema({ timestamps: true, collection: PermissionEntity.collection })
export class PermissionEntity {
  static readonly collection = 'permissions';
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;

  @Prop({ type: String, required: true, unique: true })
  name: string;

  @Prop({ type: String, required: true })
  description: string;

  @Prop({ type: String, required: true })
  resource: string;

  @Prop({ type: String, required: true, enum: PermissionAction })
  action: string;

  @Prop({ type: String, required: true })
  module: string;
}

export const PermissionEntitySchema =
  SchemaFactory.createForClass(PermissionEntity);
export type PermissionEntityDocument = Document & PermissionEntity;
