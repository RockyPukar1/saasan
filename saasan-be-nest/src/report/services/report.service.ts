import { Injectable } from '@nestjs/common';
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
import { ReportActivityService } from './report-activity.service';
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

@Injectable()
export class ReportService {
  constructor(
    private readonly reportRepo: ReportRepository,
    private cloudinaryService: CloudinaryService,
    private evidenceRepo: EvidenceRepository,
    private tx: TransactionRunner,
    private readonly activityService: ReportActivityService,
    private readonly reportTypeRepo: ReportTypeRepository,
    private readonly reportStatusRepo: ReportStatusRepository,
    private readonly reportPriorityRepo: ReportPriorityRepository,
    private readonly reportVisibilityRepo: ReportVisibilityRepository,
  ) {}

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

  async getAll(reportFilterDto: ReportFilterDto) {
    const reports = await this.reportRepo.getAll(reportFilterDto);

    return ResponseHelper.response(
      ReportSerializer,
      reports,
      'Reports fetched successfully',
    );
  }

  async getById(param: ReportIdDto) {
    const report = await this.reportRepo.findById(param);
    if (!report) {
      throw new Error('Report not found');
    }

    return ResponseHelper.response(
      ReportSerializer,
      report,
      'Report fetched successfully',
    );
  }

  async getMyReports(reporterId: string) {
    const reports = await this.reportRepo.getMyReports(reporterId);

    // Get evidence for all user reports
    const reportsWithEvidence = await Promise.all(
      reports.map(async (report) => {
        const reportData = Array.isArray(report) ? report[0] : report;

        try {
          const evidenceData = await this.evidenceRepo.findByReportId({
            reportId: reportData._id.toString(),
          });

          reportData.evidence = evidenceData?.evidences || [];
        } catch (error) {
          // If evidence fetch fails, set empty evidence array
          reportData.evidence = [];
        }

        reportData.statusUpdates = reportData.statusUpdates || [];
        reportData.sharesCount = reportData.sharesCount || 0;

        return reportData;
      }),
    );

    return ResponseHelper.response(
      ReportSerializer,
      reportsWithEvidence,
      'Reports fetched successfully',
    );
  }

  async updateReport(param: ReportIdDto, updateData: Partial<CreateReportDto>) {
    const report = await this.reportRepo.updateReport(param, updateData);
    if (!report) {
      throw new Error('Report not found');
    }

    // Get evidence for the updated report
    const evidenceData = await this.evidenceRepo.findByReportId(param);

    // Combine report data with evidence
    const reportData = Array.isArray(report) ? report[0] : report;
    reportData.evidence = evidenceData?.evidences || [];
    reportData.statusUpdates = reportData.statusUpdates || [];
    reportData.sharesCount = reportData.sharesCount || 0;

    return ResponseHelper.response(
      ReportSerializer,
      reportData,
      'Report updated successfully',
    );
  }

  async vote() {}

  async approve() {}

  async reject() {}

  async resolve() {}

  async getReportActivities(reportId: string, page?: number, limit?: number) {
    return await this.activityService.getReportActivities(
      reportId,
      page,
      limit,
    );
  }

  async getRecentActivities(limit?: number) {
    return await this.activityService.getRecentActivities(limit);
  }

  // Admin
  async adminUpdateReport(
    param: ReportIdDto,
    updateData: AdminUpdateReportDto,
  ) {
    const report = await this.reportRepo.findById(param);
    if (!report) {
      throw new Error('Report not found');
    }
    await this.reportRepo.adminUpdateReport(param, updateData);
  }

  // Report Types CRUD
  async getReportTypes() {
    const types = await this.reportTypeRepo.findAll();
    return ResponseHelper.response(
      ReportTypeSerializer,
      types,
      'Report types fetched successfully',
    );
  }

  async createReportType(createReportTypeDto: CreateReportTypeDto) {
    const type = await this.reportTypeRepo.create(createReportTypeDto);
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
    return await this.reportTypeRepo.delete(id);
  }

  // Report Statuses CRUD
  async getReportStatuses() {
    const statuses = await this.reportStatusRepo.findAll();
    return ResponseHelper.response(
      ReportStatusSerializer,
      statuses,
      'Report statuses fetched successfully',
    );
  }

  async createReportStatus(createReportStatusDto: CreateReportStatusDto) {
    const status = await this.reportStatusRepo.create(createReportStatusDto);
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
    return await this.reportStatusRepo.delete(id);
  }

  // Report Priorities CRUD
  async getReportPriorities() {
    const priorities = await this.reportPriorityRepo.findAll();
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
    return await this.reportPriorityRepo.delete(id);
  }

  // Report Visibilities CRUD
  async getReportVisibilities() {
    const visibilities = await this.reportVisibilityRepo.findAll();
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
    return await this.reportVisibilityRepo.delete(id);
  }
}
