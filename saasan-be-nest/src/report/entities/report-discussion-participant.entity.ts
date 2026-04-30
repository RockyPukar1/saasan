import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ReportEntity } from './report.entity';
import { UserEntity } from 'src/user/entities/user.entity';

@Schema({
  timestamps: true,
  collection: ReportDiscussionParticipantEntity.collection,
})
export class ReportDiscussionParticipantEntity {
  static readonly collection = 'report_discussion_participants';
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;

  @Prop({ type: Types.ObjectId, ref: ReportEntity.name, required: true })
  reportId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: UserEntity.name, required: true })
  userId: Types.ObjectId;

  @Prop({ type: Date, default: Date.now })
  joinedAt: Date;

  @Prop({ type: Date })
  lastCommentAt?: Date;
}

export const ReportDiscussionParticipantEntitySchema =
  SchemaFactory.createForClass(ReportDiscussionParticipantEntity);
ReportDiscussionParticipantEntitySchema.index(
  { reportId: 1, userId: 1 },
  { unique: true },
);
export type ReportDiscussionParticipantEntityDocument = Document &
  ReportDiscussionParticipantEntity;
