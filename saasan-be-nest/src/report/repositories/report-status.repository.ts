import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ReportStatusEntity,
  ReportStatusEntitySchema,
} from '../entities/report-status.entity';

@Injectable()
export class ReportStatusRepository {
  constructor(
    @InjectModel(ReportStatusEntity.name)
    private readonly reportStatusModel: Model<ReportStatusEntity>,
  ) {}

  async create(createReportStatusDto: any) {
    const reportStatus = new this.reportStatusModel(createReportStatusDto);
    return await reportStatus.save();
  }

  async findAll() {
    return await this.reportStatusModel.find().exec();
  }

  async findById(id: string) {
    return await this.reportStatusModel.findById(id);
  }

  async update(id: string, updateData: any) {
    return await this.reportStatusModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
  }

  async delete(id: string) {
    return await this.reportStatusModel.findByIdAndDelete(id).exec();
  }
}
