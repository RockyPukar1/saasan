import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true, collection: ReportStatusEntity.collection })
export class ReportStatusEntity {
  static readonly collection = 'report_statuses';
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;

  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: true })
  description: string;
}

export const ReportStatusEntitySchema =
  SchemaFactory.createForClass(ReportStatusEntity);

export type ReportStatusEntityDocument = Document & ReportStatusEntity;
