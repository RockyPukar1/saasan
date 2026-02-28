import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { ConstituencyEntity } from 'src/location/constituency/entities/constituency.entity';
import { DistrictEntity } from 'src/location/district/entities/district.entity';
import { MunicipalityEntity } from 'src/location/municipality/entities/municipality.entity';
import { ProvinceEntity } from 'src/location/province/entities/province.entity';
import { WardEntity } from 'src/location/ward/entities/ward.entity';
import { RoleEntity } from 'src/rbac/entities/role.entity';

export const PASSWORD_SALT = 10;

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

  @Prop({ type: Types.ObjectId, ref: ProvinceEntity.name })
  provinceId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: DistrictEntity.name })
  districtId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: MunicipalityEntity.name })
  municipalityId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: WardEntity.name })
  wardId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: ConstituencyEntity.name })
  constituencyId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: RoleEntity.name })
  adminRoleId?: Types.ObjectId;

  @Prop({ type: Boolean, default: true })
  isActive: boolean;

  @Prop({ type: Boolean, default: false })
  isVerified: boolean;

  @Prop({ type: Date })
  lastActiveAt: Date;
}

export const UserEntitySchema = SchemaFactory.createForClass(UserEntity);
export type UserEntityDocument = Document & UserEntity;
