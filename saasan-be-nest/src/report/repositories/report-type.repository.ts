import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ReportTypeEntity, ReportTypeEntitySchema } from '../entities/report-type.entity';

@Injectable()
export class ReportTypeRepository {
  constructor(
    @InjectModel(ReportTypeEntity.name)
    private readonly reportTypeModel: Model<ReportTypeEntity>,
  ) {}

  async create(createReportTypeDto: any) {
    const reportType = new this.reportTypeModel(createReportTypeDto);
    return await reportType.save();
  }

  async findAll() {
    return await this.reportTypeModel.find().exec();
  }

  async findById(id: string) {
    return await this.reportTypeModel.findById(id).exec();
  }

  async update(id: string, updateData: any) {
    return await this.reportTypeModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
  }

  async delete(id: string) {
    return await this.reportTypeModel.findByIdAndDelete(id).exec();
  }
}
