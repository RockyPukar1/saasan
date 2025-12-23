import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true, collection: ReportEntity.collection })
export class ReportEntity {
  static readonly collection = 'reports';
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;

  @Prop({ type: String, required: true })
  fullName: string;

  @Prop({ type: Number, default: 'N/A' })
  age: number;

  @Prop({ type: String, default: 'N/A' })
  education: string;

  @Prop({ type: String, default: 'N/A' })
  profession: string;

  @Prop({ type: String, default: 'N/A' })
  constituencyId?: Types.ObjectId;

  @Prop({ type: Boolean, default: true })
  isIndependent: boolean;

  @Prop({ type: Types.ObjectId })
  partyId?: Types.ObjectId;

  @Prop({ type: String })
  position?: string;

  @Prop({ type: Number, default: 0 })
  experienceYears?: number;

  @Prop({ type: String, default: 'N/A' })
  photoUrl?: string;

  @Prop({ type: Boolean, default: true })
  isActive?: boolean;

  @Prop({ type: Number, default: 0 })
  rating?: number;

  @Prop({ type: Number, default: 0 })
  totalReports?: number;

  @Prop({ type: Number, default: 0 })
  verifiedReports?: number;
}

export const ReportEntitySchema = SchemaFactory.createForClass(ReportEntity);
export type ReportEntityDocument = Document & ReportEntity;
