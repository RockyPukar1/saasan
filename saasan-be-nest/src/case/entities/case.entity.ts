import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export enum CaseStatus {
  UNSOLVED = 'unsolved',
  ONGOING = 'ongoing',
  SOLVED = 'solved',
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
    type: Types.Decimal128,
    required: true,
    default: 0,
    get: (val: Types.Decimal128) => (val ? val.toString() : val),
  })
  amountInvolved: Types.Decimal128;

  @Prop({ type: Date, required: true })
  dateOccurred: Date;

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
export type CaseEntityDocument = Document & CaseEntity;
