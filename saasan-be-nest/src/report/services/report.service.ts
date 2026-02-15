import { Injectable } from '@nestjs/common';
import { ReportRepository } from '../repositories/report.repository';
import { CreateReportDto } from '../dtos/create-report.dto';
import { ResponseHelper } from 'src/common/helpers/response.helper';
import { ReportSerializer } from '../serializers/report.serializer';
import { EvidenceIdDto } from '../dtos/evidence-id.dto';
import { UpdateReportStatusDto } from '../dtos/update-report-status.dto';
import { ReportIdDto } from '../dtos/report-id.dto';

@Injectable()
export class ReportService {
  constructor(private readonly reportRepo: ReportRepository) {}

  async create(reportData: CreateReportDto) {
    const report = await this.reportRepo.create(reportData);
    return ResponseHelper.response(
      ReportSerializer,
      report,
      'Report created successfully',
    );
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
