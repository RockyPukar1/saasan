import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  ReportDiscussionCommentVoteEntity,
  ReportDiscussionCommentVoteEntityDocument,
} from '../entities/report-discussion-comment-vote.entity';

@Injectable()
export class ReportDiscussionCommentVoteRepository {
  constructor(
    @InjectModel(ReportDiscussionCommentVoteEntity.name)
    private readonly model: Model<ReportDiscussionCommentVoteEntityDocument>,
  ) {}

  async findOne(userId: string, commentId: string | Types.ObjectId) {
    return await this.model
      .findOne({
        userId: new Types.ObjectId(userId),
        commentId: new Types.ObjectId(commentId),
      })
      .exec();
  }

  async findByUserAndCommentIds(
    userId: string,
    commentIds: Array<string | Types.ObjectId>,
  ) {
    if (!commentIds.length) {
      return [];
    }

    return await this.model
      .find({
        userId: new Types.ObjectId(userId),
        commentId: {
          $in: commentIds.map((commentId) => new Types.ObjectId(commentId)),
        },
      })
      .exec();
  }

  async create(
    userId: string,
    commentId: string | Types.ObjectId,
    direction: 'up' | 'down',
  ) {
    return await this.model.create({
      userId: new Types.ObjectId(userId),
      commentId: new Types.ObjectId(commentId),
      direction,
    });
  }

  async updateDirection(
    voteId: string | Types.ObjectId,
    direction: 'up' | 'down',
  ) {
    return await this.model.findByIdAndUpdate(
      voteId,
      { $set: { direction } },
      { new: true },
    );
  }

  async deleteById(voteId: string | Types.ObjectId) {
    return await this.model.findByIdAndDelete(voteId).exec();
  }
}
