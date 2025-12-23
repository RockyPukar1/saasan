import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { ConstituencyEntity } from 'src/location/constituency/entities/constituency.entity';
import { DistrictEntity } from 'src/location/district/entities/district.entity';
import { MunicipalityEntity } from 'src/location/municipality/entities/municipality.entity';
import { ProvinceEntity } from 'src/location/province/entities/province.entity';
import { WardEntity } from 'src/location/ward/entities/ward.entity';

export enum CaseStatus {
  UNSOLVED = 'unsolved',
  ONGOING = 'ongoing',
  SOLVED = 'solved',
}

export enum CaseUrgency {
  URGENT = 'urgent',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
}

@Schema({ timestamps: true, collection: CaseEntity.collection })
export class CaseEntity {
  static readonly collection = 'cases';
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;

  @Prop({ type: Number, unique: true })
  referenceNumber?: number;

  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: true })
  description: string;

  @Prop({
    type: String,
    enum: CaseStatus,
    default: CaseStatus.UNSOLVED,
  })
  status: CaseStatus;

  @Prop({
    type: String,
    enum: CaseUrgency,
    default: CaseUrgency.LOW,
  })
  priority: CaseUrgency;

  @Prop({
    type: Types.Decimal128,
    required: true,
    default: 0,
    get: (val: Types.Decimal128) => (val ? val.toString() : val),
  })
  amountInvolved: Types.Decimal128;

  @Prop({ type: Number, default: 0 })
  upvotesCount?: Number;

  @Prop({ type: Number, default: 0 })
  downvotesCount?: Number;

  @Prop({ type: Number, default: 0 })
  viewsCount?: Number;

  @Prop({ type: Number, default: 0 })
  sharesCount?: Number;

  @Prop({ type: Types.ObjectId, ref: ProvinceEntity.name })
  provinceId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: DistrictEntity.name })
  districtId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: ConstituencyEntity.name })
  constituencyId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: MunicipalityEntity.name })
  municipalityId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: WardEntity.name })
  wardId?: Types.ObjectId;

  @Prop({ type: Date, required: true })
  dateOccurred: Date;

  @Prop({ type: Number, default: 0 })
  peopleAffectedCount: number;

  @Prop({ type: Boolean, default: true })
  isPublic?: boolean;
}

export const CaseEntitySchema = SchemaFactory.createForClass(CaseEntity);
export type CaseEntityDocument = Document & CaseEntity;
