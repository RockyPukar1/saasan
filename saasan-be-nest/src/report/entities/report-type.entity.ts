import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true, collection: ReportTypeEntity.collection })
export class ReportTypeEntity {
  static readonly collection = 'report_types';
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;

  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: true })
  description: string;
}

export const ReportTypeEntitySchema =
  SchemaFactory.createForClass(ReportTypeEntity);

export type ReportTypeEntityDocument = Document & ReportTypeEntity;
