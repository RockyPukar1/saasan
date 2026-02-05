import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export const PASSWORD_SALT = 10;

export enum UserRole {
  ADMIN = 'admin',
  POLITICIAN = 'politician',
  CITIZEN = 'citizen',
}

@Schema({ timestamps: true, collection: UserEntity.collection })
export class UserEntity {
  static readonly collection = 'users';
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;

  @Prop({ type: String, unique: true, required: true })
  email: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: String, required: true })
  fullName: string;

  @Prop({ type: Types.ObjectId, ref: 'ProvinceEntity' })
  provinceId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'DistrictEntity' })
  districtId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'MunicipalityEntity' })
  municipalityId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'WardEntity' })
  wardId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'ConstituencyEntity' })
  constituencyId?: Types.ObjectId;

  @Prop({
    type: String,
    enum: UserRole,
    default: UserRole.CITIZEN,
  })
  role: UserRole;

  @Prop({ type: Boolean, default: true })
  isActive: boolean;

  @Prop({ type: Boolean, default: false })
  isVerified: boolean;

  @Prop({ type: Date })
  lastActiveAt: Date;
}

export const UserEntitySchema = SchemaFactory.createForClass(UserEntity);
export type UserEntityDocument = Document & UserEntity;
