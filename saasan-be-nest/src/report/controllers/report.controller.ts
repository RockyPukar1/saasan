import { Body, Controller, Get, HttpCode, Param, Post, Put, Req, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { ReportService } from '../services/report.service';
import { CreateReportDto } from '../dtos/create-report.dto';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { type Request } from 'express';
import { HttpAccessTokenGuard } from 'src/common/guards/http-access-token.guard';
import { EvidenceIdDto } from '../dtos/evidence-id.dto';
import { UpdateReportStatusDto } from '../dtos/update-report-status.dto';

@UseGuards(HttpAccessTokenGuard)
@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}
  
  @HttpCode(201)
  @Post()
  @UseInterceptors(AnyFilesInterceptor())
  async create(
    @Req() req: Request,
    @Body() reportData: CreateReportDto,
  ) {
    await this.reportService.create({ ...reportData, reporterId: req.user.id });
  }

  @Get(":evidenceId")
  async getEvidenceById(@Param() param: EvidenceIdDto) {
    return await this.reportService.getEvidenceById(param)
  }

  @Get()
  async getAll() {
    return await this.reportService.getAll();
  }

  @Get("my-reports")
  async getMyReports(@Req() req: Request) {
    return await this.reportService.getMyReports(req.user.id)
  }

  @HttpCode(204)
  @Put(':reportId/status')
  async updateStatus(@Body() body: UpdateReportStatusDto, @Param() evidenceIdDto: EvidenceIdDto) {
    await this.reportService.updateStatus(evidenceIdDto, body)
  }

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
