import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CaseEntity, CaseEntityDocument } from '../entities/case.entity';

@Injectable()
export class CaseRepository {
  constructor(
    @InjectModel(CaseEntity.name)
    private readonly model: Model<CaseEntityDocument>,
  ) {}

  async getTotalCasesCount() {
    return await this.countDocuments();
  }

  async getResolvedCasesCount() {
    return await this.countDocuments({ status: 'solved' });
  }

  async getRecentCases() {
    return await this.model.find().sort({ createdAt: -1 }).limit(5);
  }

  async getVolumeTrend(days = 7) {
    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    startDate.setDate(startDate.getDate() - (days - 1));

    return await this.model.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          date: '$_id',
          count: 1,
        },
      },
      {
        $sort: { date: 1 },
      },
    ]);
  }

  private async countDocuments(filter?: any) {
    return await this.model.countDocuments(filter);
  }
}
