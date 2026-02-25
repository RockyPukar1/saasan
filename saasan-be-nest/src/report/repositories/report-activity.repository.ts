import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  ReportActivityEntity,
  ReportActivityEntityDocument,
} from '../entities/report-activity.entity';
import { Model, Types } from 'mongoose';
import { CreateReportActivityDto } from '../dtos/create-report-activity.dto';
import { ClientSession } from 'mongoose';

@Injectable()
export class ReportActivityRepository {
  constructor(
    @InjectModel(ReportActivityEntity.name)
    private readonly model: Model<ReportActivityEntityDocument>,
  ) {}

  async create({
    category,
    reportId,
    modifiedBy,
    oldValue,
    newValue,
    comment,
  }: CreateReportActivityDto) {
    await this.model.updateOne(
      {
        reportId: new Types.ObjectId(reportId),
      },
      {
        $setOnInsert: {
          reportId: new Types.ObjectId(reportId),
        },
        $push: {
          activities: {
            category,
            modifiedBy: {
              id: new Types.ObjectId(modifiedBy.id),
              fullName: modifiedBy.fullName,
            },
            oldValue,
            newValue,
            comment,
          },
        },
      },
      {
        upsert: true,
      },
    );
  }

  async deleteByReportId(reportId: string) {
    await this.model.deleteMany({
      reportId: new Types.ObjectId(reportId),
    });
  }
}
