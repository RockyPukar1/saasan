import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ReportEntity } from './report.entity';
import { UserEntity } from 'src/user/entities/user.entity';

export enum ReportDiscussionAuthorRole {
  ADMIN = 'admin',
  CITIZEN = 'citizen',
  POLITICIAN = 'politician',
}

@Schema({
  timestamps: true,
  collection: ReportDiscussionCommentEntity.collection,
})
export class ReportDiscussionCommentEntity {
  static readonly collection = 'report_discussion_comments';
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;

  @Prop({ type: Types.ObjectId, ref: ReportEntity.name, required: true })
  reportId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: UserEntity.name, required: true })
  authorId: Types.ObjectId;

  @Prop({
    type: String,
    enum: ReportDiscussionAuthorRole,
    required: true,
  })
  authorRole: ReportDiscussionAuthorRole;

  @Prop({ type: String, required: true })
  authorDisplayName: string;

  @Prop({ type: Boolean, default: false })
  isReportOwner: boolean;

  @Prop({ type: String, required: true })
  content: string;

  @Prop({ type: Number, default: 0 })
  upvotesCount: number;

  @Prop({ type: Number, default: 0 })
  downvotesCount: number;

  @Prop({ type: Types.ObjectId, ref: ReportDiscussionCommentEntity.name })
  parentCommentId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: ReportDiscussionCommentEntity.name })
  threadRootCommentId?: Types.ObjectId;

  @Prop({ type: Number, default: 0 })
  depth: number;
}

export const ReportDiscussionCommentEntitySchema = SchemaFactory.createForClass(
  ReportDiscussionCommentEntity,
);
export type ReportDiscussionCommentEntityDocument = Document &
  ReportDiscussionCommentEntity;
