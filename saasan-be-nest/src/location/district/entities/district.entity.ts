import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true, collection: DistrictEntity.collection })
export class DistrictEntity {
  static readonly collection = 'districts';
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: Types.ObjectId, ref: 'ProvinceEntity' })
  provinceId: Types.ObjectId;

  @Prop({ type: String, required: true })
  headquarter: string;
}

export const DistrictEntitySchema =
  SchemaFactory.createForClass(DistrictEntity);
export type DistrictEntityDocument = Document & DistrictEntity;
