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
import { ClientSession } from 'mongoose';

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

      const filesToUpload = files.map((file) => async () => {
        const uploadResult = await this.cloudinaryService.uploadFile(file);
        const fileType = getFileType(file.mimetype);

        return {
          fileName: uploadResult.public_id,
          originalName: file.originalname,
          filePath: uploadResult.secure_url,
          mimeType: file.mimetype,
          fileSize: file.size,
          fileType,
          uploadedAt: new Date(),
          cloudinaryPublicId: uploadResult.public_id,
        };
      });

      const uploads = await Promise.all(filesToUpload);

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
    return ResponseHelper.response(
      ReportSerializer,
      reports,
      'Reports fetched successfully',
    );
  }

  async getMyReports(reporterId: string) {
    const reports = await this.reportRepo.getMyReports(reporterId);
    return ResponseHelper.response(
      ReportSerializer,
      reports,
      'Reports fetched successfully',
    );
  }

  async updateStatus(
    evidenceIdDto: EvidenceIdDto,
    data: UpdateReportStatusDto,
  ) {
    await this.reportRepo.updateStatus(evidenceIdDto, data);
  }

  async vote() {}

  async approve() {}

  async reject() {}

  async resolve() {}
}
