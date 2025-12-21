import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { DistrictEntity } from '../../district/entities/district.entity';
import { MunicipalityEntity } from 'src/location/municipality/entities/municipality.entity';
import { ProvinceEntity } from 'src/location/province/entities/province.entity';
import { ConstituencyEntity } from 'src/location/constituency/entities/constituency.entity';

@Schema({ timestamps: true, collection: WardEntity.collection })
export class WardEntity {
  static readonly collection = 'wards';
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;

  @Prop({ type: Number, required: true })
  wardNumber: number;

  @Prop({ type: Types.ObjectId, ref: ProvinceEntity.name })
  provinceId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: DistrictEntity.name })
  districtId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: ConstituencyEntity.name })
  constituencyId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: MunicipalityEntity.name })
  municipalityId: Types.ObjectId;
}

export const WardEntitySchema = SchemaFactory.createForClass(WardEntity);
export type WardEntityDocument = Document & WardEntity;
