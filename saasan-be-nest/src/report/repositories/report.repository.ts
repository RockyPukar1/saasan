import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ReportEntity, ReportEntityDocument } from '../entities/report.entity';
import { ClientSession, Model, Types } from 'mongoose';
import { CreateReportDto } from '../dtos/create-report.dto';
import { ReportIdDto } from '../dtos/report-id.dto';
import { AdminUpdateReportDto } from '../dtos/admin-update-report.dto';
import { ReportFilterDto } from '../dtos/report-filter.dto';

@Injectable()
export class ReportRepository {
  constructor(
    @InjectModel(ReportEntity.name)
    private readonly model: Model<ReportEntityDocument>,
  ) {}

  async create(
    { reporterId, ...data }: CreateReportDto,
    session?: ClientSession,
  ) {
    return await this.model.create(
      [
        {
          ...data,
          reporterId: new Types.ObjectId(reporterId),
        },
      ],
      { session },
    );
  }

  async findById({ reportId }: ReportIdDto) {
    return (
      (
        await this.model.aggregate([
          { $match: { _id: new Types.ObjectId(reportId) } },
          {
            $lookup: {
              from: 'report_evidences',
              localField: '_id',
              foreignField: 'reportId',
              as: 'evidenceData',
            },
          },
          {
            $addFields: {
              evidences: { $arrayElemAt: ['$evidenceData.evidences', 0] },
            },
          },
          {
            $project: {
              evidenceData: 0,
            },
          },
        ])
      )[0] || null
    );
  }

  async deleteById({ reportId }: ReportIdDto) {
    await this.model.findByIdAndDelete(reportId);
  }

  async deleteByReportId(reportId: string): Promise<any> {
    return await this.model.deleteMany({
      reportId: new Types.ObjectId(reportId),
    });
  }

  async getAll(reportFilterDto: ReportFilterDto) {
    const priorityIds = (reportFilterDto?.priority || []).map(
      (id) => new Types.ObjectId(id),
    );
    const statusIds = (reportFilterDto?.status || []).map(
      (id) => new Types.ObjectId(id),
    );
    const typeIds = (reportFilterDto?.type || []).map(
      (id) => new Types.ObjectId(id),
    );
    const visibilityIds = (reportFilterDto?.visibility || []).map(
      (id) => new Types.ObjectId(id),
    );

    const hasFilters =
      priorityIds.length > 0 ||
      statusIds.length > 0 ||
      typeIds.length > 0 ||
      visibilityIds.length > 0;

    return await this.model.aggregate([
      {
        $lookup: {
          from: 'report_evidences',
          localField: '_id',
          foreignField: 'reportId',
          as: 'evidenceData',
        },
      },
      {
        $lookup: {
          from: 'report_types',
          localField: 'typeId',
          foreignField: '_id',
          as: 'typeData',
        },
      },
      {
        $lookup: {
          from: 'report_visibilities',
          localField: 'visibilityId',
          foreignField: '_id',
          as: 'visibilityData',
        },
      },
      {
        $lookup: {
          from: 'report_statuses',
          localField: 'statusId',
          foreignField: '_id',
          as: 'statusData',
        },
      },
      {
        $lookup: {
          from: 'report_priorities',
          localField: 'priorityId',
          foreignField: '_id',
          as: 'priorityData',
        },
      },
      ...(hasFilters
        ? [
            {
              $match: {
                $or: [
                  { typeId: { $in: typeIds } },
                  { visibilityId: { $in: visibilityIds } },
                  { statusId: { $in: statusIds } },
                  { priorityId: { $in: priorityIds } },
                ],
              },
            },
          ]
        : []),
      {
        $addFields: {
          evidences: { $arrayElemAt: ['$evidenceData.evidences', 0] },
          sourceCategories: {
            type: { $arrayElemAt: ['$typeData.title', 0] },
            visibility: { $arrayElemAt: ['$visibilityData.title', 0] },
            status: { $arrayElemAt: ['$statusData.title', 0] },
            priority: { $arrayElemAt: ['$priorityData.title', 0] },
          },
        },
      },
      {
        $project: {
          typeData: 0,
          visibilityData: 0,
          statusData: 0,
          priorityData: 0,
          evidenceData: 0,
        },
      },
    ]);
  }

  async getMyReports(reporterId: string) {
    return await this.model.find({
      reporterId: new Types.ObjectId(reporterId),
    });
  }

  async updateReport(
    { reportId }: ReportIdDto,
    updateData: Partial<CreateReportDto>,
  ) {
    return await this.model.findByIdAndUpdate(
      reportId,
      { $set: updateData },
      { new: true },
    );
  }

  async getTotalReportsCount() {
    return await this.countDocuments();
  }

  async getResolvedReportsCount() {
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

  async addActivityToReport(reportId: string, activityId: string) {
    return await this.model.findByIdAndUpdate(
      reportId,
      {
        $push: { activityLog: new Types.ObjectId(activityId) },
      },
      { new: true },
    );
  }

  // Admin
  async findByTypeId(typeId: string) {
    return await this.model.find({ typeId: new Types.ObjectId(typeId) }).exec();
  }

  async findByStatusId(statusId: string) {
    return await this.model
      .find({ statusId: new Types.ObjectId(statusId) })
      .exec();
  }

  async findByPriorityId(priorityId: string) {
    return await this.model
      .find({ priorityId: new Types.ObjectId(priorityId) })
      .exec();
  }

  async findByVisibilityId(visibilityId: string) {
    return await this.model
      .find({ visibilityId: new Types.ObjectId(visibilityId) })
      .exec();
  }

  async adminUpdateReport(
    { reportId }: ReportIdDto,
    { comment, ...rest }: AdminUpdateReportDto,
  ) {
    const arr = Object.entries(rest).map(([key, value]) => ({
      [key]: new Types.ObjectId(value),
    }));
    const updateData = Object.assign({}, ...arr);

    console.log(updateData, reportId);
    return await this.model.findByIdAndUpdate(reportId, {
      $set: {
        ...updateData,
        comment,
      },
    });
  }
}
