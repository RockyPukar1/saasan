import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  ReportDiscussionCommentEntity,
  ReportDiscussionCommentEntityDocument,
} from '../entities/report-discussion-comment.entity';

@Injectable()
export class ReportDiscussionCommentRepository {
  constructor(
    @InjectModel(ReportDiscussionCommentEntity.name)
    private readonly model: Model<ReportDiscussionCommentEntityDocument>,
  ) {}

  async create(data: Partial<ReportDiscussionCommentEntity>) {
    return await this.model.create(data);
  }

  async findById(commentId: string | Types.ObjectId) {
    return await this.model.findById(commentId).exec();
  }

  async findByReportId(reportId: string) {
    return await this.model
      .find({ reportId: new Types.ObjectId(reportId) })
      .sort({ createdAt: 1 })
      .exec();
  }

  async adjustVoteCounts(
    commentId: string | Types.ObjectId,
    changes: Partial<Record<'upvotesCount' | 'downvotesCount', number>>,
  ) {
    return await this.model
      .findByIdAndUpdate(commentId, { $inc: changes }, { new: true })
      .exec();
  }
}
