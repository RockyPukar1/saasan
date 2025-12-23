import { Injectable } from '@nestjs/common';
import { ReportRepository } from '../repositories/report.repository';
import { CreateReportDto } from '../dtos/create-report.dto';
import { ResponseHelper } from 'src/common/helpers/response.helper';

@Injectable()
export class ReportService {
  constructor(private readonly reportRepo: ReportRepository) {}

  async create(reportData: CreateReportDto) {
    await this.reportRepo.create(reportData);
  }

  async getAll() {
    const reports = await this.reportRepo.getAll();
    return ResponseHelper.success(reports);
  }

  async updateStatus() {}

  async uploadEvidence() {}

  async vote() {}

  async approve() {}

  async reject() {}

  async resolve() {}
}
