import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true, collection: ReportPriorityEntity.collection })
export class ReportPriorityEntity {
  static readonly collection = 'report_priorities';
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;

  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: true })
  description: string;
}

export const ReportPriorityEntitySchema =
  SchemaFactory.createForClass(ReportPriorityEntity);

export type ReportPriorityEntityDocument = Document & ReportPriorityEntity;
