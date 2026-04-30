import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  ReportDiscussionParticipantEntity,
  ReportDiscussionParticipantEntityDocument,
} from '../entities/report-discussion-participant.entity';

@Injectable()
export class ReportDiscussionParticipantRepository {
  constructor(
    @InjectModel(ReportDiscussionParticipantEntity.name)
    private readonly model: Model<ReportDiscussionParticipantEntityDocument>,
  ) {}

  async upsertJoin(reportId: string, userId: string, lastCommentAt?: Date) {
    return await this.model
      .findOneAndUpdate(
        {
          reportId: new Types.ObjectId(reportId),
          userId: new Types.ObjectId(userId),
        },
        {
          $setOnInsert: {
            reportId: new Types.ObjectId(reportId),
            userId: new Types.ObjectId(userId),
            joinedAt: new Date(),
          },
          ...(lastCommentAt ? { $set: { lastCommentAt } } : {}),
        },
        {
          upsert: true,
          new: true,
        },
      )
      .exec();
  }

  async findOne(reportId: string, userId: string) {
    return await this.model
      .findOne({
        reportId: new Types.ObjectId(reportId),
        userId: new Types.ObjectId(userId),
      })
      .exec();
  }

  async countByReportId(reportId: string) {
    return await this.model.countDocuments({
      reportId: new Types.ObjectId(reportId),
    });
  }
}
