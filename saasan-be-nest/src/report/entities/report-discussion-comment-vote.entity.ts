import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { UserEntity } from 'src/user/entities/user.entity';
import { ReportDiscussionCommentEntity } from './report-discussion-comment.entity';

@Schema({
  timestamps: true,
  collection: ReportDiscussionCommentVoteEntity.collection,
})
export class ReportDiscussionCommentVoteEntity {
  static readonly collection = 'report_discussion_comment_votes';
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;

  @Prop({
    type: Types.ObjectId,
    ref: ReportDiscussionCommentEntity.name,
    required: true,
  })
  commentId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: UserEntity.name, required: true })
  userId: Types.ObjectId;

  @Prop({ type: String, enum: ['up', 'down'], required: true })
  direction: 'up' | 'down';
}

export const ReportDiscussionCommentVoteEntitySchema =
  SchemaFactory.createForClass(ReportDiscussionCommentVoteEntity);

ReportDiscussionCommentVoteEntitySchema.index(
  { userId: 1, commentId: 1 },
  { unique: true },
);

export type ReportDiscussionCommentVoteEntityDocument = Document &
  ReportDiscussionCommentVoteEntity;
