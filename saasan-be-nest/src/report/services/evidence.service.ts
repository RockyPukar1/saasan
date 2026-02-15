import { Injectable } from '@nestjs/common';
import { ReportIdDto } from '../dtos/report-id.dto';
import { EvidenceIdDto } from '../dtos/evidence-id.dto';
import { EvidenceRepository } from '../repositories/evidence.repository';
import { CloudinaryService } from 'src/common/cloudinary/services/cloudinary.service';
import { ResponseHelper } from 'src/common/helpers/response.helper';

@Injectable()
export class EvidenceService {
  constructor(
    private cloudinaryService: CloudinaryService,
    private evidenceRepo: EvidenceRepository,
  ) {}

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
}
