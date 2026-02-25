import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  ReportActivityEntity,
  ReportActivityEntityDocument,
} from '../entities/report-activity.entity';
import { Model, Types } from 'mongoose';

export interface CreateActivityData {
  reportId: string;
  modifiedById: string;
  activityType: string;
  oldStatus?: string;
  newStatus?: string;
  oldPriority?: string;
  newPriority?: string;
  oldVisibility?: string;
  newVisibility?: string;
  oldType?: string;
  newType?: string;
  comment?: string;
  assignedToId?: string;
  oldAssignedToId?: string;
}

@Injectable()
export class ReportActivityRepository {
  constructor(
    @InjectModel(ReportActivityEntity.name)
    private readonly model: Model<ReportActivityEntityDocument>,
  ) {}

  async create(activityData: CreateActivityData) {
    const activity = new this.model({
      ...activityData,
      reportId: new Types.ObjectId(activityData.reportId),
      modifiedById: new Types.ObjectId(activityData.modifiedById),
      ...(activityData.assignedToId && {
        assignedToId: new Types.ObjectId(activityData.assignedToId),
      }),
      ...(activityData.oldAssignedToId && {
        oldAssignedToId: new Types.ObjectId(activityData.oldAssignedToId),
      }),
    });

    return await activity.save();
  }

  async findByReportId(reportId: string) {
    return await this.model
      .find({ reportId: new Types.ObjectId(reportId) })
      .populate('modifiedById', 'name email')
      .populate('assignedToId', 'name email')
      .sort({ createdAt: -1 });
  }

  async findByReportIdWithPagination(
    reportId: string,
    page: number = 1,
    limit: number = 20,
  ) {
    const skip = (page - 1) * limit;

    const [activities, total] = await Promise.all([
      this.model
        .find({ reportId: new Types.ObjectId(reportId) })
        .populate('modifiedById', 'name email')
        .populate('assignedToId', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      this.model.countDocuments({ reportId: new Types.ObjectId(reportId) }),
    ]);

    return {
      activities,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findByActivityType(activityType: string) {
    return await this.model
      .find({ activityType })
      .populate('modifiedById', 'name email')
      .populate('reportId', 'title referenceNumber')
      .sort({ createdAt: -1 });
  }

  async findByModifiedBy(modifiedById: string) {
    return await this.model
      .find({ modifiedById: new Types.ObjectId(modifiedById) })
      .populate('reportId', 'title referenceNumber')
      .sort({ createdAt: -1 });
  }

  async getRecentActivities(limit: number = 50) {
    return await this.model
      .find()
      .populate('modifiedById', 'name email')
      .populate('reportId', 'title referenceNumber')
      .populate('assignedToId', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit);
  }

  async deleteByReportId(reportId: string): Promise<any> {
    return await this.model.deleteMany({
      reportId: new Types.ObjectId(reportId),
    });
  }
}
