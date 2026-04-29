import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { UserEntity } from './user.entity';

@Schema({ timestamps: true, collection: CitizenEntity.collection })
export class CitizenEntity {
  static readonly collection = 'citizens';
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

  @Prop({ type: String })
  phone?: string;

  @Prop({ type: String })
  avatarUrl?: string;
}

export const CitizenEntitySchema = SchemaFactory.createForClass(CitizenEntity);
export type CitizenEntityDocument = Document & CitizenEntity;
