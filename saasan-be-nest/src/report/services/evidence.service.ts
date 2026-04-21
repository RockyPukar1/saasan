import { Injectable } from '@nestjs/common';
import { ReportIdDto } from '../dtos/report-id.dto';
import { EvidenceIdDto } from '../dtos/evidence-id.dto';
import { EvidenceRepository } from '../repositories/evidence.repository';
import { CloudinaryService } from 'src/common/cloudinary/services/cloudinary.service';
import { ResponseHelper } from 'src/common/helpers/response.helper';
import { getFileType } from 'src/common/helpers/file-type.helper';
import { ClientSession, Types } from 'mongoose';
import { TransactionRunner } from 'src/common/transaction/runners/transaction.runner';
import { FilePublisher } from 'src/common/file/publishers/file.publisher';
import { FILE_EVENT_TYPES } from 'src/common/file/events/file.events';

@Injectable()
export class EvidenceService {
  constructor(
    private cloudinaryService: CloudinaryService,
    private evidenceRepo: EvidenceRepository,
    private tx: TransactionRunner,
    private filePublisher: FilePublisher,
  ) {}

  async getEvidencesByReport(reportIdDto: ReportIdDto) {
    const evidence = await this.evidenceRepo.findByReportId(reportIdDto);
    return ResponseHelper.success(evidence?.evidences || []);
  }

  async uploadEvidence(reportIdDto: ReportIdDto, files: Express.Multer.File[]) {
    console.log('Starting uploadEvidence with files:', files);

    // Process files one by one to avoid Promise.all issues
    const uploads: any[] = [];

    for (const file of files) {
      console.log('Processing file:', file.originalname);
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

      console.log('Created evidence object:', evidence);
      uploads.push(evidence);
    }

    await this.evidenceRepo.addEvidence(reportIdDto, uploads);

    await this.filePublisher.publishEvidenceUploaded({
      type: FILE_EVENT_TYPES.EVIDENCE_UPLOADED,
      reportId: reportIdDto.reportId,
      retryCount: 0,
      files: uploads.map((item) => ({
        originalName: item.originalName,
        mimeType: item.mimeType,
        fileSize: item.fileSize,
        fileType: item.fileType,
        filePath: item.filePath,
        cloudinaryPublicId: item.cloudinaryPublicId,
      })),
    });
  }

  async updateEvidence(
    reportIdDto: ReportIdDto,
    updateData: {
      evidenceToAdd?: Express.Multer.File[];
      evidenceToRemove?: string[];
    },
  ) {
    await this.tx.run<boolean>(async (session: ClientSession) => {
      // Remove evidence first
      if (
        updateData.evidenceToRemove &&
        updateData.evidenceToRemove.length > 0
      ) {
        const currentEvidence =
          await this.evidenceRepo.findByReportId(reportIdDto);
        const evidenceToRemove =
          currentEvidence?.evidences?.filter((e) =>
            updateData.evidenceToRemove!.includes(e._id.toString()),
          ) || [];

        // Delete from Cloudinary and database
        for (const evidence of evidenceToRemove) {
          await this.cloudinaryService.deleteFile(evidence.cloudinaryPublicId);
          await this.evidenceRepo.removeEvidence(reportIdDto, {
            evidenceId: evidence._id.toString(),
          });
        }
      }

      // Add new evidence
      if (updateData.evidenceToAdd && updateData.evidenceToAdd.length > 0) {
        const uploads: any[] = [];

        for (const file of updateData.evidenceToAdd) {
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

        await this.evidenceRepo.addEvidence(reportIdDto, uploads, session);

        await this.filePublisher.publishEvidenceUploaded({
          type: FILE_EVENT_TYPES.EVIDENCE_UPLOADED,
          reportId: reportIdDto.reportId,
          retryCount: 0,
          files: uploads.map((item) => ({
            originalName: item.originalName,
            mimeType: item.mimeType,
            fileSize: item.fileSize,
            fileType: item.fileType,
            filePath: item.filePath,
            cloudinaryPublicId: item.cloudinaryPublicId,
          })),
        });
      }

      return true;
    });
  }

  async deleteEvidence(
    evidenceIdDto: EvidenceIdDto,
    reportIdDto: ReportIdDto,
    cloudinaryPublicId: string,
  ) {
    await this.cloudinaryService.deleteFile(cloudinaryPublicId);
    await this.evidenceRepo.removeEvidence(reportIdDto, evidenceIdDto);
  }

  async removeEvidence(
    reportIdDto: ReportIdDto,
    evidenceIdDto: EvidenceIdDto,
    cloudinaryPublicId: string,
  ) {
    await this.cloudinaryService.deleteFile(cloudinaryPublicId);
    await this.evidenceRepo.removeEvidence(reportIdDto, evidenceIdDto);
  }
}
