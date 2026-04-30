import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  ReportVoteEntity,
  ReportVoteEntityDocument,
} from '../entities/report-vote.entity';

@Injectable()
export class ReportVoteRepository {
  constructor(
    @InjectModel(ReportVoteEntity.name)
    private readonly model: Model<ReportVoteEntityDocument>,
  ) {}

  async findOne(userId: string, reportId: string) {
    return await this.model.findOne({
      userId: new Types.ObjectId(userId),
      reportId: new Types.ObjectId(reportId),
    });
  }

  async create(userId: string, reportId: string, direction: 'up' | 'down') {
    return await this.model.create({
      userId: new Types.ObjectId(userId),
      reportId: new Types.ObjectId(reportId),
      direction,
    });
  }

  async updateDirection(
    voteId: Types.ObjectId | string,
    direction: 'up' | 'down',
  ) {
    return await this.model.findByIdAndUpdate(
      voteId,
      { $set: { direction } },
      { new: true },
    );
  }
}
