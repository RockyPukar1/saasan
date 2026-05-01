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

  async getByReportId(reportId: string, page = 1, limit = 20) {
    const record = await this.model.findOne({
      reportId: new Types.ObjectId(reportId),
    });

    const activities = [...(record?.activities || [])].sort(
      (a, b) =>
        new Date(b.modifiedAt).getTime() - new Date(a.modifiedAt).getTime(),
    );

    const start = (page - 1) * limit;
    const data = activities.slice(start, start + limit);

    return {
      data,
      total: activities.length,
      page,
      limit,
    };
  }

  async getRecent(limit = 10) {
    const records = await this.model
      .find()
      .sort({ updatedAt: -1 })
      .limit(Math.max(limit, 1));

    return records
      .flatMap((record) =>
        record.activities.map((activity) => ({
          category: activity.category,
          modifiedBy: activity.modifiedBy,
          oldValue: activity.oldValue,
          newValue: activity.newValue,
          modifiedAt: activity.modifiedAt,
          comment: activity.comment,
          reportId: record.reportId.toString(),
        })),
      )
      .sort(
        (a, b) =>
          new Date(b.modifiedAt).getTime() - new Date(a.modifiedAt).getTime(),
      )
      .slice(0, limit);
  }
}
