import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ReportPriorityEntity,
  ReportPriorityEntitySchema,
} from '../entities/report-priority.entity';

@Injectable()
export class ReportPriorityRepository {
  constructor(
    @InjectModel(ReportPriorityEntity.name)
    private readonly reportPriorityModel: Model<ReportPriorityEntity>,
  ) {}

  async create(createReportPriorityDto: any) {
    const reportPriority = new this.reportPriorityModel(
      createReportPriorityDto,
    );
    return await reportPriority.save();
  }

  async findAll() {
    return await this.reportPriorityModel.find().exec();
  }

  async findById(id: string) {
    return await this.reportPriorityModel.findById(id);
  }

  async update(id: string, updateData: any) {
    return await this.reportPriorityModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
  }

  async delete(id: string) {
    return await this.reportPriorityModel.findByIdAndDelete(id).exec();
  }
}
