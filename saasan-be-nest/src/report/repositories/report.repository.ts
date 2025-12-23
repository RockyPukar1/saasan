import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ReportEntity, ReportEntityDocument } from '../entities/report.entity';
import { Model } from 'mongoose';
import { CreateReportDto } from '../dtos/create-report.dto';

@Injectable()
export class ReportRepository {
  constructor(
    @InjectModel(ReportEntity.name)
    private readonly model: Model<ReportEntityDocument>,
  ) {}

  async create(reportData: CreateReportDto) {
    await this.model.create(reportData);
  }

  async getAll() {
    return await this.model.find();
  }

  async getTotalReports() {
    return await this.countDocuments();
  }

  async getResolvedReports() {
    return await this.countDocuments({ status: 'resolved' });
  }

  async getRecentReports() {
    return await this.model.find().sort({ createdAt: -1 }).limit(5);
  }

  async getStatsByCategory() {
    return await this.model.aggregate([
      {
        $match: { category: { $ne: null } },
      },
      {
        $sortByCount: '$category',
      },
      {
        $project: {
          categoryName: '$_id',
          count: '$count',
          _id: 0,
        },
      },
    ]);
  }

  async getStatsByDistrict() {
    return await this.model.aggregate([
      {
        $group: {
          _id: '$district', // group by 'district' field
          totalReports: { $sum: 1 }, // count total documents in each group
          uniqueReports: { $addToSet: '$id' }, // create a set of unique 'id' values
          avgAmount: { $avg: '$amountInvolved' }, // calculate the average of amountInvolved
        },
      },
      {
        $project: {
          _id: 0, // exclude the default _id field from the final output
          district: '$_id', // rename id to district
          totalReports: '$totalReports',
          uniqueReports: { $size: '$uniqueReports' },
          avgAmount: '$avgAmount',
        },
      },
      {
        $sort: { totalReports: -1 },
      },
    ]);
  }

  async getMajorCases() {
    return await this.model
      .find({
        isPublic: true,
        $or: [
          { priority: 'urgent' },
          { amountInvolved: { $gt: 1000000 } },
          { upvotes: { $gt: 50 } },
        ],
      })
      .sort({ createdAt: -1 })
      .limit(10);
  }

  private async countDocuments(filter?: any) {
    return await this.model.countDocuments(filter);
  }
}
