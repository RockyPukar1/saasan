import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { UserEntity } from './user.entity';

@Schema({ timestamps: true, collection: AdminEntity.collection })
export class AdminEntity {
  static readonly collection = 'admins';
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;

  @Prop({
    type: Types.ObjectId,
    ref: UserEntity.name,
    required: true,
    unique: true,
  })
  userId: Types.ObjectId;

  @Prop({ type: String, required: true })
  fullName: string;

  @Prop({ type: String })
  phone?: string;

  @Prop({ type: String })
  designation?: string;

  @Prop({ type: String })
  department?: string;

  @Prop({ type: String })
  avatarUrl?: string;
}

export const AdminEntitySchema = SchemaFactory.createForClass(AdminEntity);
export type AdminEntityDocument = Document & AdminEntity;
