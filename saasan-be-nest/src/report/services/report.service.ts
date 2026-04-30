import { HttpStatus, Injectable } from '@nestjs/common';
import { ReportRepository } from '../repositories/report.repository';
import { CreateReportDto } from '../dtos/create-report.dto';
import { ResponseHelper } from 'src/common/helpers/response.helper';
import { ReportSerializer } from '../serializers/report.serializer';
import { ReportIdDto } from '../dtos/report-id.dto';
import { CloudinaryService } from 'src/common/cloudinary/services/cloudinary.service';
import { EvidenceRepository } from '../repositories/evidence.repository';
import { getFileType } from 'src/common/helpers/file-type.helper';
import { TransactionRunner } from 'src/common/transaction/runners/transaction.runner';
import { ClientSession, Types } from 'mongoose';
import { AdminUpdateReportDto } from '../dtos/admin-update-report.dto';
import { CreateReportTypeDto } from '../dtos/create-report-type.dto';
import { CreateReportStatusDto } from '../dtos/create-report-status.dto';
import { CreateReportPriorityDto } from '../dtos/create-report-priority.dto';
import { ReportFilterDto } from '../dtos/report-filter.dto';
import { ReportTypeRepository } from '../repositories/report-type.repository';
import { ReportStatusRepository } from '../repositories/report-status.repository';
import { ReportPriorityRepository } from '../repositories/report-priority.repository';
import { ReportVisibilityRepository } from '../repositories/report-visibility.repository';
import { ReportTypeSerializer } from '../serializers/report-type.serializer';
import { ReportStatusSerializer } from '../serializers/report-status.serializer';
import { ReportPrioritySerializer } from '../serializers/report-priority.serializer';
import { ReportVisibilitySerializer } from '../serializers/report-visibility.serializer';
import { CreateReportVisibilityDto } from '../dtos/create-report-visibility.dto';
import { ReportActivityRepository } from '../repositories/report-activity.repository';
import { UserRepository } from 'src/user/repositories/user.repository';
import { GlobalHttpException } from 'src/common/exceptions/global-http.exception';
import { Logger } from '@nestjs/common';
import { RedisCacheService } from 'src/common/cache/services/redis-cache.service';
import { ReportToMessageService } from './report-to-message.service';
import { AdminRepository } from 'src/user/repositories/admin.repository';
import { ReportVoteRepository } from '../repositories/report-vote.repository';

@Injectable()
export class ReportService {
  private readonly logger = new Logger(ReportService.name);

  constructor(
    private readonly reportRepo: ReportRepository,
    private cloudinaryService: CloudinaryService,
    private evidenceRepo: EvidenceRepository,
    private tx: TransactionRunner,
    private readonly reportToMessageService: ReportToMessageService,
    private readonly userRepo: UserRepository,
    private readonly adminRepo: AdminRepository,
    private readonly reportActivityRepo: ReportActivityRepository,
    private readonly reportTypeRepo: ReportTypeRepository,
    private readonly reportStatusRepo: ReportStatusRepository,
    private readonly reportPriorityRepo: ReportPriorityRepository,
    private readonly reportVisibilityRepo: ReportVisibilityRepository,
    private readonly redisCache: RedisCacheService,
    private readonly reportVoteRepo: ReportVoteRepository,
  ) {}

  private getReporterId(report: any): string | null {
    const reporterId = report?.reporterId;

    if (!reporterId) {
      return null;
    }

    if (typeof reporterId === 'string') {
      return reporterId;
    }

    if (reporterId instanceof Types.ObjectId) {
      return reporterId.toString();
    }

    if (typeof reporterId === 'object' && reporterId._id) {
      return reporterId._id.toString();
    }

    return reporterId.toString?.() || null;
  }

  async create(reportData: CreateReportDto, files: Express.Multer.File[]) {
    let createdReportId: string = '';
    let reporterId: string = reportData.reporterId;

    await this.tx.run<boolean>(async (session: ClientSession) => {
      const report = await this.reportRepo.create(reportData, session);
      createdReportId = report[0]._id.toString();
      reporterId = reportData.reporterId;

      // Process files one by one to avoid Promise.all issues
      const uploads: any[] = [];

      for (const file of files) {
        const uploadResult = await this.cloudinaryService.uploadFile(file);
        const fileType = getFileType(file.mimetype);

        const evidence = {
          _id: new Types.ObjectId(),
          fileName: uploadResult.public_id,
          originalName: file.originalname,
          filePath: uploadResult.secure_url,
          mimeType: file.mimetype,
          fileSize: file.size,
          fileType,
          uploadedAt: new Date(),
          cloudinaryPublicId: uploadResult.public_id,
        };

        uploads.push(evidence);
      }

      await this.evidenceRepo.addEvidence(
        { reportId: report[0]._id.toString() },
        uploads,
        session,
      );
      return false;
    });

    // Log the report creation activity
    if (createdReportId && reporterId) {
      // await this.activityService.logReportCreation(
      //   createdReportId,
      //   reporterId,
      //   'Report created successfully',
      // );
    }
  }

  async deleteById(data: ReportIdDto) {
    await this.reportRepo.deleteById(data);
    // TODO: remove evidence using transaction
  }

  async getAll(reportFilterDto: ReportFilterDto, requesterId?: string) {
    const reports = await this.reportRepo.getAll(reportFilterDto, requesterId);

    return ResponseHelper.response(
      ReportSerializer,
      reports,
      'Reports fetched successfully',
    );
  }

  async getById(param: ReportIdDto, requesterId?: string) {
    const report = await this.reportRepo.findById(param, requesterId);
    if (!report) {
      throw new Error('Report not found');
    }

    const reportWithPermissions = {
      ...report,
      canEdit: !!requesterId && this.getReporterId(report) === requesterId,
    };

    return ResponseHelper.response(
      ReportSerializer,
      reportWithPermissions,
      'Report fetched successfully',
    );
  }

  async getMyReports(reporterId: string) {
    const reports = await this.reportRepo.getMyReports(reporterId, reporterId);

    const reportsWithPermissions = reports.map((report) => ({
      ...report,
      statusUpdates: report.statusUpdates || [],
      sharesCount: report.sharesCount || 0,
      canEdit: true,
    }));

    return ResponseHelper.response(
      ReportSerializer,
      reportsWithPermissions,
      'Reports fetched successfully',
    );
  }

  async updateReport(
    param: ReportIdDto,
    updateData: Partial<CreateReportDto>,
    requesterId?: string,
  ) {
    const report = await this.reportRepo.findById(param);
    if (!report) {
      throw new GlobalHttpException('report404', HttpStatus.NOT_FOUND);
    }

    await this.reportRepo.updateReport(param, updateData);
    const updatedReport = await this.reportRepo.findById(param, requesterId);
    const reportWithPermissions = {
      ...updatedReport,
      canEdit: !!requesterId && this.getReporterId(updatedReport) === requesterId,
    };

    return ResponseHelper.response(
      ReportSerializer,
      reportWithPermissions,
      'Report updated successfully',
    );
  }

  async updateOwnReport(
    param: ReportIdDto,
    userId: string,
    updateData: Partial<CreateReportDto>,
  ) {
    const report = await this.reportRepo.findById(param);
    if (!report) {
      throw new GlobalHttpException('report404', HttpStatus.NOT_FOUND);
    }

    if (this.getReporterId(report) !== userId) {
      throw new GlobalHttpException('permission403', HttpStatus.FORBIDDEN);
    }

    return this.updateReport(param, updateData, userId);
  }

  async vote(
    param: ReportIdDto,
    userId: string,
    direction: 'up' | 'down' = 'up',
  ) {
    const report = await this.reportRepo.findById(param, userId);
    if (!report) {
      throw new GlobalHttpException('report404', HttpStatus.NOT_FOUND);
    }

    const existingVote = await this.reportVoteRepo.findOne(userId, param.reportId);

    if (!existingVote) {
      await this.reportVoteRepo.create(userId, param.reportId, direction);
      await this.reportRepo.adjustVoteCounts(param.reportId, {
        [direction === 'up' ? 'upvotesCount' : 'downvotesCount']: 1,
      });
    } else if (existingVote.direction !== direction) {
      await this.reportVoteRepo.updateDirection(existingVote._id, direction);
      await this.reportRepo.adjustVoteCounts(param.reportId, {
        [existingVote.direction === 'up' ? 'upvotesCount' : 'downvotesCount']:
          -1,
        [direction === 'up' ? 'upvotesCount' : 'downvotesCount']: 1,
      });
    }

    const refreshedReport = await this.reportRepo.findById(param, userId);
    const reportWithPermissions = {
      ...refreshedReport,
      canEdit: this.getReporterId(refreshedReport) === userId,
    };

    return ResponseHelper.response(
      ReportSerializer,
      reportWithPermissions,
      `Report ${direction}vote recorded successfully`,
    );
  }

  async share(param: ReportIdDto, requesterId?: string) {
    const report = await this.reportRepo.findById(param);
    if (!report) {
      throw new GlobalHttpException('report404', HttpStatus.NOT_FOUND);
    }

    await this.reportRepo.incrementShareCount(param.reportId);
    const updatedReport = await this.reportRepo.findById(param, requesterId);
    const reportWithPermissions = {
      ...updatedReport,
      canEdit:
        !!requesterId && this.getReporterId(updatedReport) === requesterId,
    };

    return ResponseHelper.response(
      ReportSerializer,
      reportWithPermissions,
      'Report share tracked successfully',
    );
  }

  async approve() {}

  async reject() {}

  async resolve() {}

  // Admin
  async adminUpdateReport(
    param: ReportIdDto,
    modifiedById: string,
    updateData: AdminUpdateReportDto,
  ) {
    const report = await this.reportRepo.findById(param);
    if (!report)
      throw new GlobalHttpException('report404', HttpStatus.NOT_FOUND);

    const user = await this.userRepo.findById({ userId: modifiedById });
    if (!user) throw new GlobalHttpException('user404', HttpStatus.NOT_FOUND);
    const adminProfile = await this.adminRepo
      .findByUserId({ userId: modifiedById })
      .lean();

    let category: Record<string, Record<string, string>> = {};
    if (updateData?.typeId) {
      const oldValue = await this.reportTypeRepo.findById(report.typeId);
      const newValue = await this.reportTypeRepo.findById(updateData.typeId);
      category.type = {
        oldValue: oldValue?.title ?? '',
        newValue: newValue?.title ?? '',
      };
    }
    if (updateData?.priorityId) {
      const oldValue = await this.reportPriorityRepo.findById(
        report.priorityId,
      );
      const newValue = await this.reportPriorityRepo.findById(
        updateData.priorityId,
      );
      category.priority = {
        oldValue: oldValue?.title ?? '',
        newValue: newValue?.title ?? '',
      };
    }
    if (updateData?.statusId) {
      const oldValue = await this.reportStatusRepo.findById(report.statusId);
      const newValue = await this.reportStatusRepo.findById(
        updateData.statusId,
      );
      category.status = {
        oldValue: oldValue?.title ?? '',
        newValue: newValue?.title ?? '',
      };
    }
    if (updateData?.visibilityId) {
      const oldValue = await this.reportVisibilityRepo.findById(
        report.visibilityId,
      );
      const newValue = await this.reportVisibilityRepo.findById(
        updateData.visibilityId,
      );
      category.visibility = {
        oldValue: oldValue?.title ?? '',
        newValue: newValue?.title ?? '',
      };
    }

    await this.reportRepo.adminUpdateReport(param, updateData);
    await Promise.all(
      Object.entries(category).map(([key, value]) =>
        this.reportActivityRepo.create({
          reportId: param.reportId,
          category: key,
          comment: updateData.comment,
          modifiedBy: {
            id: modifiedById,
            fullName: adminProfile?.fullName || user.email,
          },
          oldValue: value.oldValue,
          newValue: value.newValue,
        }),
      ),
    );
  }

  // Report Types CRUD
  async getReportTypes() {
    const cacheKey = 'report:types';

    const cached = await this.redisCache.get(cacheKey);
    if (cached) {
      return ResponseHelper.response(
        ReportTypeSerializer,
        cached,
        'Report types fetched successfully',
      );
    }

    const types = await this.reportTypeRepo.findAll();

    await this.redisCache.set(cacheKey, types);

    return ResponseHelper.response(
      ReportTypeSerializer,
      types,
      'Report types fetched successfully',
    );
  }

  async createReportType(createReportTypeDto: CreateReportTypeDto) {
    const type = await this.reportTypeRepo.create(createReportTypeDto);

    await this.redisCache.del('report:types');

    return ResponseHelper.response(
      ReportTypeSerializer,
      type,
      'Report type created successfully',
    );
  }

  async updateReportType(id: string, updateData: CreateReportTypeDto) {
    const type = await this.reportTypeRepo.update(id, updateData);
    return ResponseHelper.response(
      ReportTypeSerializer,
      type,
      'Report type updated successfully',
    );
  }

  async deleteReportType(id: string) {
    // Check if any reports are using this report type
    const reportsUsingType = await this.reportRepo.findByTypeId(id);
    if (reportsUsingType && reportsUsingType.length > 0) {
      throw new Error(
        `Cannot delete report type. ${reportsUsingType.length} report(s) are currently assigned to this type.`,
      );
    }
    await this.reportTypeRepo.delete(id);

    await this.redisCache.del('report:types');
  }

  // Report Statuses CRUD
  async getReportStatuses() {
    const cacheKey = 'report:statuses';

    const cached = await this.redisCache.get(cacheKey);
    if (cached) {
      return ResponseHelper.response(
        ReportTypeSerializer,
        cached,
        'Report statuses fetched successfully',
      );
    }

    const statuses = await this.reportStatusRepo.findAll();

    await this.redisCache.set(cacheKey, statuses);
    return ResponseHelper.response(
      ReportStatusSerializer,
      statuses,
      'Report statuses fetched successfully',
    );
  }

  async createReportStatus(createReportStatusDto: CreateReportStatusDto) {
    const status = await this.reportStatusRepo.create(createReportStatusDto);

    await this.redisCache.del('report:statuses');

    return ResponseHelper.response(
      ReportStatusSerializer,
      status,
      'Report status created successfully',
    );
  }

  async updateReportStatus(id: string, updateData: CreateReportStatusDto) {
    const status = await this.reportStatusRepo.update(id, updateData);
    return ResponseHelper.response(
      ReportStatusSerializer,
      status,
      'Report status updated successfully',
    );
  }

  async deleteReportStatus(id: string) {
    // Check if any reports are using this report status
    const reportsUsingStatus = await this.reportRepo.findByStatusId(id);
    if (reportsUsingStatus && reportsUsingStatus.length > 0) {
      throw new Error(
        `Cannot delete report status. ${reportsUsingStatus.length} report(s) are currently assigned to this status.`,
      );
    }
    await this.reportStatusRepo.delete(id);

    await this.redisCache.del('report:statuses');
  }

  // Report Priorities CRUD
  async getReportPriorities() {
    const cacheKey = 'report:priorities';

    const cached = await this.redisCache.get(cacheKey);
    if (cached) {
      return ResponseHelper.response(
        ReportPrioritySerializer,
        cached,
        'Report priorities fetched successfully',
      );
    }

    const priorities = await this.reportPriorityRepo.findAll();

    await this.redisCache.set(cacheKey, priorities);

    return ResponseHelper.response(
      ReportPrioritySerializer,
      priorities,
      'Report priorities fetched successfully',
    );
  }

  async createReportPriority(createReportPriorityDto: CreateReportPriorityDto) {
    const priority = await this.reportPriorityRepo.create(
      createReportPriorityDto,
    );

    await this.redisCache.del('report:priorities');

    return ResponseHelper.response(
      ReportPrioritySerializer,
      priority,
      'Report priority created successfully',
    );
  }

  async updateReportPriority(id: string, updateData: CreateReportPriorityDto) {
    const priority = await this.reportPriorityRepo.update(id, updateData);
    return ResponseHelper.response(
      ReportPrioritySerializer,
      priority,
      'Report priority updated successfully',
    );
  }

  async deleteReportPriority(id: string) {
    // Check if any reports are using this report priority
    const reportsUsingPriority = await this.reportRepo.findByPriorityId(id);
    if (reportsUsingPriority && reportsUsingPriority.length > 0) {
      throw new Error(
        `Cannot delete report priority. ${reportsUsingPriority.length} report(s) are currently assigned to this priority.`,
      );
    }
    await this.reportPriorityRepo.delete(id);

    await this.redisCache.del('report:priorities');
  }

  // Report Visibilities CRUD
  async getReportVisibilities() {
    const cacheKey = 'report:visibilities';

    const cached = await this.redisCache.get(cacheKey);
    if (cached) {
      return ResponseHelper.response(
        ReportVisibilitySerializer,
        cached,
        'Report visibilities fetched successfully',
      );
    }

    const visibilities = await this.reportVisibilityRepo.findAll();

    await this.redisCache.set(cacheKey, visibilities);

    return ResponseHelper.response(
      ReportVisibilitySerializer,
      visibilities,
      'Report visibilities fetched successfully',
    );
  }

  async createReportVisibility(
    createReportVisibilityDto: CreateReportVisibilityDto,
  ) {
    const visibility = await this.reportVisibilityRepo.create(
      createReportVisibilityDto,
    );

    await this.redisCache.del('report:visibilities');

    return ResponseHelper.response(
      ReportVisibilitySerializer,
      visibility,
      'Report visibility created successfully',
    );
  }

  async updateReportVisibility(
    id: string,
    updateData: CreateReportVisibilityDto,
  ) {
    const visibility = await this.reportVisibilityRepo.update(id, updateData);

    return ResponseHelper.response(
      ReportVisibilitySerializer,
      visibility,
      'Report visibility updated successfully',
    );
  }

  async deleteReportVisibility(id: string) {
    // Check if any reports are using this report visibility
    const reportsUsingVisibility = await this.reportRepo.findByVisibilityId(id);
    if (reportsUsingVisibility && reportsUsingVisibility.length > 0) {
      throw new Error(
        `Cannot delete report visibility. ${reportsUsingVisibility.length} report(s) are currently assigned to this visibility.`,
      );
    }
    await this.reportVisibilityRepo.delete(id);

    await this.redisCache.del('report:visibilities');
  }

  async approveReport(reportId: string, approvalData: any) {
    return await this.reportToMessageService.approveReport({
      reportId,
      ...approvalData,
    });
  }

  async escalateReport(
    reportId: string,
    escalationData: { escalateTo: string; reason: string },
  ) {
    return await this.reportToMessageService.escalateReport(
      reportId,
      escalationData.escalateTo,
      escalationData.reason,
    );
  }
}
