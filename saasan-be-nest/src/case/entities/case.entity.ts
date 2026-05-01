import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum CaseStatus {
  UNSOLVED = 'unsolved',
  ONGOING = 'ongoing',
  SOLVED = 'solved',
}

export enum CasePriority {
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
    enum: CasePriority,
    default: CasePriority.MEDIUM,
  })
  priority: CasePriority;

  @Prop({
    type: Types.Decimal128,
    required: true,
    default: 0,
    get: (val: Types.Decimal128) => (val ? val.toString() : val),
  })
  amountInvolved: Types.Decimal128;

  @Prop({ type: Date, required: true })
  dateOccurred: Date;

  @Prop({ type: String, unique: true })
  referenceNumber: string;

  @Prop({ type: Types.ObjectId, ref: 'ProvinceEntity' })
  provinceId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'DistrictEntity' })
  districtId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'ConstituencyEntity' })
  constituencyId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'MunicipalityEntity' })
  municipalityId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'WardEntity' })
  wardId?: Types.ObjectId;

  @Prop({ type: String })
  locationDescription?: string;

  @Prop({ type: Number, default: 0 })
  peopleAffectedCount: number;

  @Prop({ type: Number, default: 0 })
  upvotesCount?: Number;

  @Prop({ type: Number, default: 0 })
  downvotesCount?: Number;

  @Prop({ type: Number, default: 0 })
  viewsCount?: Number;

  @Prop({ type: Number, default: 0 })
  sharesCount?: Number;

  @Prop({ type: Boolean, default: true })
  isPublic?: boolean;
}

export const CaseEntitySchema = SchemaFactory.createForClass(CaseEntity);

CaseEntitySchema.pre('save', function () {
  if (!this.referenceNumber) {
    const ymd = new Date(Date.now())
      .toISOString()
      .slice(0, 10)
      .replace(/-/g, '');
    const shortId = this._id.toString().slice(-6).toUpperCase();
    this.referenceNumber = `CASE-${ymd}-${shortId}`;
  }
});

export type CaseEntityDocument = Document & CaseEntity;
