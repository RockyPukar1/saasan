import { Body, Controller, Get, HttpCode, Post, Put } from '@nestjs/common';
import { ReportService } from '../services/report.service';
import { CreateReportDto } from '../dtos/create-report.dto';

@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}
  @HttpCode(201)
  @Post()
  async create(@Body() reportData: CreateReportDto) {
    await this.reportService.create(reportData);
  }

  @Get()
  async getAll() {
    return await this.reportService.getAll();
  }

  @HttpCode(204)
  @Put(':reportId/status')
  async updateStatus() {}

  @HttpCode(204)
  @Put(':reportId/evidence')
  async uploadEvidence() {}

  @HttpCode(204)
  @Put(':reportId/vote')
  async vote() {}

  // Admin routes for report management
  @HttpCode(204)
  @Post(':reportId/approve')
  async approve() {}

  @HttpCode(204)
  @Post(':reportId/reject')
  async reject() {}

  @HttpCode(204)
  @Post(':reportId/resolve')
  async resolve() {}
}
