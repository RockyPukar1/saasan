import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true, collection: ReportVisibilityEntity.collection })
export class ReportVisibilityEntity {
  static readonly collection = 'report_visibilities';
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;

  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: true })
  description: string;
}

export const ReportVisibilityEntitySchema = SchemaFactory.createForClass(
  ReportVisibilityEntity,
);

export type ReportVisibilityEntityDocument = Document & ReportVisibilityEntity;
