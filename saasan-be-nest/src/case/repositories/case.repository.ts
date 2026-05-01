import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CaseEntity, CaseEntityDocument } from '../entities/case.entity';
import { CreateCaseDto } from '../dtos/create-case.dto';
import { UpdateCaseDto } from '../dtos/update-case.dto';

@Injectable()
export class CaseRepository {
  constructor(
    @InjectModel(CaseEntity.name)
    private readonly model: Model<CaseEntityDocument>,
  ) {}

  async getAll({
    search,
    status,
    priority,
    page = 1,
    limit = 50,
  }: {
    search?: string;
    status?: string;
    priority?: string;
    page?: number;
    limit?: number;
  }) {
    const skip = (page - 1) * limit;
    const filter: Record<string, any> = {};

    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { referenceNumber: { $regex: search, $options: 'i' } },
        { locationDescription: { $regex: search, $options: 'i' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.model.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      this.model.countDocuments(filter),
    ]);

    return { data, total, page, limit };
  }

  async findById(caseId: string) {
    return await this.model.findById(caseId);
  }

  async create(caseData: CreateCaseDto) {
    return await this.model.create(caseData);
  }

  async update(caseId: string, updateData: UpdateCaseDto) {
    return await this.model.findByIdAndUpdate(
      caseId,
      { $set: updateData },
      { new: true },
    );
  }

  async delete(caseId: string) {
    return await this.model.findByIdAndDelete(caseId);
  }

  async updateStatus(caseId: string, status: string) {
    return await this.model.findByIdAndUpdate(
      caseId,
      { $set: { status } },
      { new: true },
    );
  }

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
