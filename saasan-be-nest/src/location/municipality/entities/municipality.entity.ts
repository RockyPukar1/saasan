import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true, collection: MunicipalityEntity.collection })
export class MunicipalityEntity {
  static readonly collection = 'municipalities';
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: Types.ObjectId, ref: 'ProvinceEntity' })
  provinceId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'DistrictEntity' })
  districtId: Types.ObjectId;
}

export const MunicipalityEntitySchema =
  SchemaFactory.createForClass(MunicipalityEntity);
export type MunicipalityEntityDocument = Document & MunicipalityEntity;
