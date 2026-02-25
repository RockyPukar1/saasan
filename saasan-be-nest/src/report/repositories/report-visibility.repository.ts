import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ReportVisibilityEntity,
  ReportVisibilityEntitySchema,
} from '../entities/report-visibility.entity';

@Injectable()
export class ReportVisibilityRepository {
  constructor(
    @InjectModel(ReportVisibilityEntity.name)
    private readonly reportVisibilityModel: Model<ReportVisibilityEntity>,
  ) {}

  async create(createReportVisibilityDto: any) {
    const reportVisibility = new this.reportVisibilityModel(
      createReportVisibilityDto,
    );
    return await reportVisibility.save();
  }

  async findAll() {
    return await this.reportVisibilityModel.find().exec();
  }

  async findById(id: string) {
    return await this.reportVisibilityModel.findById(id);
  }

  async update(id: string, updateData: any) {
    return await this.reportVisibilityModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
  }

  async delete(id: string) {
    return await this.reportVisibilityModel.findByIdAndDelete(id).exec();
  }
}
