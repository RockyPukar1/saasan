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
    return await this.countDocuments({ status: 'resolved' });
  }

  async getRecentCases() {
    return await this.model.find().sort({ createdAt: -1 }).limit(5);
  }

  private async countDocuments(filter?: any) {
    return await this.model.countDocuments(filter);
  }
}
