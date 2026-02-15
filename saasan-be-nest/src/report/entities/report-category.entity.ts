import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true, collection: ReportCategoryEntity.collection })
export class ReportCategoryEntity {
  static readonly collection = 'report-categories';
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;

  @Prop({ type: String, required: true })
  category: string;
}

export const ReportCategoryEntitySchema =
  SchemaFactory.createForClass(ReportCategoryEntity);
export type ReportCategoryEntityDocument = Document & ReportCategoryEntity;
