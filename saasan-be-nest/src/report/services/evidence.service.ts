import { HttpStatus, Injectable } from '@nestjs/common';
import { ReportIdDto } from '../dtos/report-id.dto';
import { UserIdDto } from 'src/user/dtos/user-id.dto';
import { EvidenceIdDto } from '../dtos/evidence-id.dto';
import { EvidenceRepository } from '../repositories/evidence.repository';
import { CloudinaryService } from 'src/common/cloudinary/services/cloudinary.service';
import { ResponseHelper } from 'src/common/helpers/response.helper';
import { FileTypeEnum } from '../entities/evidence.entity';
import { ReportRepository } from '../repositories/report.repository';
import { GlobalHttpException } from 'src/common/exceptions/global-http.exception';

@Injectable()
export class EvidenceService {
  constructor(
    private cloudinaryService: CloudinaryService,
    private evidenceRepo: EvidenceRepository,
    private reportRepo: ReportRepository,
  ) {}

  async uploadEvidence(reportIdDto: ReportIdDto, file: Express.Multer.File) {
    const report = await this.reportRepo.findById(reportIdDto);
    if (!report)
      throw new GlobalHttpException('report404', HttpStatus.NOT_FOUND);

    const uploadResult = await this.cloudinaryService.uploadFile(file);

    const fileType = this.getFileType(file.mimetype);

    const newEvidence = {
      fileName: uploadResult.public_id,
      originalName: file.originalname,
      filePath: uploadResult.secure_url,
      mimeType: file.mimetype,
      fileSize: file.size,
      fileType,
      uploadedAt: new Date(),
      cloudinaryPublicId: uploadResult.public_id,
    };

    await this.evidenceRepo.addEvidence(reportIdDto, newEvidence);
  }

  async getEvidencesByReport(reportIdDto: ReportIdDto) {
    const evidence = await this.evidenceRepo.findByReportId(reportIdDto);
    return ResponseHelper.success(evidence?.evidences || []);
  }

  async deleteEvidence(
    evidenceIdDto: EvidenceIdDto,
    reportIdDto: ReportIdDto,
    cloudinaryPublicId: string,
  ) {
    await this.cloudinaryService.deleteFile(cloudinaryPublicId);
    await this.evidenceRepo.removeEvidence(reportIdDto, evidenceIdDto);
  }

  private getFileType(mimeType: string): FileTypeEnum {
    if (mimeType.startsWith('image')) return FileTypeEnum.IMAGE;
    if (mimeType.startsWith('video')) return FileTypeEnum.VIDEO;
    if (mimeType.startsWith('audio')) return FileTypeEnum.AUDIO;
    return FileTypeEnum.DOCUMENT;
  }
}
