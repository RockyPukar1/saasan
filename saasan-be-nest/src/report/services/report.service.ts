import { Injectable } from '@nestjs/common';
import { ReportRepository } from '../repositories/report.repository';
import { CreateReportDto } from '../dtos/create-report.dto';
import { ResponseHelper } from 'src/common/helpers/response.helper';
import { ReportSerializer } from '../serializers/report.serializer';
import { EvidenceIdDto } from '../dtos/evidence-id.dto';
import { UpdateReportStatusDto } from '../dtos/update-report-status.dto';

@Injectable()
export class ReportService {
  constructor(private readonly reportRepo: ReportRepository) {}

  async create(reportData: CreateReportDto) {
    await this.reportRepo.create(reportData);
  }

  async getEvidenceById(data: EvidenceIdDto) {
    const report = await this.reportRepo.findById(data)
    return ResponseHelper.response(ReportSerializer, report, "Report fetched successfully");
  }

  async getAll() {
    const reports = await this.reportRepo.getAll();
    return ResponseHelper.response(ReportSerializer, reports, "Reports fetched successfully");
  }
  
  async getMyReports(reporterId: string) {
    const reports = await this.reportRepo.getMyReports(reporterId)
    return ResponseHelper.response(ReportSerializer, reports, "Reports fetched successfully");
  }

  async updateStatus(evidenceIdDto: EvidenceIdDto, data: UpdateReportStatusDto) {
    await this.reportRepo.updateStatus(evidenceIdDto, data)
  }

  async uploadEvidence() {}

  async vote() {}

  async approve() {}

  async reject() {}

  async resolve() {}
}
