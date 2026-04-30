import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { PoliticianEntity } from './politician.entity';

export enum PoliticianAnnouncementType {
  NOTICE = 'notice',
  UPDATE = 'update',
  ACHIEVEMENT = 'achievement',
  MEETING = 'meeting',
}

export enum PoliticianAnnouncementPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

@Schema({
  timestamps: true,
  collection: PoliticianAnnouncementEntity.collection,
})
export class PoliticianAnnouncementEntity {
  static readonly collection = 'politician_announcements';
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;

  @Prop({ type: Types.ObjectId, ref: PoliticianEntity.name, required: true })
  politicianId: Types.ObjectId;

  @Prop({ type: String, required: true, trim: true })
  title: string;

  @Prop({ type: String, required: true, trim: true })
  content: string;

  @Prop({
    type: String,
    enum: PoliticianAnnouncementType,
    default: PoliticianAnnouncementType.UPDATE,
  })
  type: PoliticianAnnouncementType;

  @Prop({
    type: String,
    enum: PoliticianAnnouncementPriority,
    default: PoliticianAnnouncementPriority.MEDIUM,
  })
  priority: PoliticianAnnouncementPriority;

  @Prop({ type: Boolean, default: true })
  isPublic: boolean;

  @Prop({ type: Date })
  scheduledAt?: Date | null;

  @Prop({ type: Date })
  publishedAt?: Date | null;

  @Prop({ type: Types.ObjectId, ref: PoliticianEntity.name, required: true })
  createdBy: Types.ObjectId;
}

export const PoliticianAnnouncementSchema = SchemaFactory.createForClass(
  PoliticianAnnouncementEntity,
);
export type PoliticianAnnouncementEntityDocument = Document &
  PoliticianAnnouncementEntity;
