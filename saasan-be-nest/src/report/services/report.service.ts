import { Injectable } from '@nestjs/common';
import { ReportRepository } from '../repositories/report.repository';
import { CreateReportDto } from '../dtos/create-report.dto';
import { ResponseHelper } from 'src/common/helpers/response.helper';
import { ReportSerializer } from '../serializers/report.serializer';
import { EvidenceIdDto } from '../dtos/evidence-id.dto';
import { UpdateReportStatusDto } from '../dtos/update-report-status.dto';
import { ReportIdDto } from '../dtos/report-id.dto';
import { CloudinaryService } from 'src/common/cloudinary/services/cloudinary.service';
import { EvidenceRepository } from '../repositories/evidence.repository';
import { getFileType } from 'src/common/helpers/file-type.helper';
import { TransactionRunner } from 'src/common/transaction/runners/transaction.runner';
import { ClientSession, Types } from 'mongoose';

@Injectable()
export class ReportService {
  constructor(
    private readonly reportRepo: ReportRepository,
    private cloudinaryService: CloudinaryService,
    private evidenceRepo: EvidenceRepository,
    private tx: TransactionRunner,
  ) {}

  async create(reportData: CreateReportDto, files: Express.Multer.File[]) {
    await this.tx.run<boolean>(async (session: ClientSession) => {
      const report = await this.reportRepo.create(reportData, session);

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
  }

  async deleteById(data: ReportIdDto) {
    await this.reportRepo.deleteById(data);
    // TODO: remove evidence using transaction
  }

  async getAll() {
    const reports = await this.reportRepo.getAll();

    // Get evidence for all reports
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

  async getById(param: ReportIdDto) {
    const report = await this.reportRepo.getById(param);
    if (!report) {
      throw new Error('Report not found');
    }

    // Get evidence for this report
    const evidenceData = await this.evidenceRepo.findByReportId(param);

    // Combine report data with evidence
    const reportData = Array.isArray(report) ? report[0] : report;
    reportData.evidence = evidenceData?.evidences || [];
    reportData.statusUpdates = reportData.statusUpdates || [];
    reportData.sharesCount = reportData.sharesCount || 0;

    return ResponseHelper.response(
      ReportSerializer,
      reportData,
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

  async updateStatus(
    evidenceIdDto: EvidenceIdDto,
    data: UpdateReportStatusDto,
  ) {
    await this.reportRepo.updateStatus(evidenceIdDto, data);
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
}
