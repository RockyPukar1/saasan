import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { DistrictEntity } from 'src/location/district/entities/district.entity';
import { ProvinceEntity } from 'src/location/province/entities/province.entity';

@Schema({ timestamps: true, collection: ConstituencyEntity.collection })
export class ConstituencyEntity {
  static readonly collection = 'constituencies';
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;

  @Prop({ type: Types.ObjectId, ref: 'ProvinceEntity' })
  provinceId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'DistrictEntity' })
  districtId: Types.ObjectId;

  @Prop({ type: Number, required: true })
  constituencyNumber: number;

  @Prop({ type: Number, default: 0 })
  totalVoters: number;
}

export const ConstituencyEntitySchema =
  SchemaFactory.createForClass(ConstituencyEntity);
export type ConstituencyEntityDocument = Document & ConstituencyEntity;
