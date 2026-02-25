import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  HttpCode,
  HttpStatus,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Put,
  Query,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ReportService } from '../services/report.service';
import { CreateReportDto } from '../dtos/create-report.dto';
import { type Request } from 'express';
import { HttpAccessTokenGuard } from 'src/common/guards/http-access-token.guard';
import { ReportIdDto } from '../dtos/report-id.dto';
import { GetReportActivitiesDto } from '../dtos/get-report-activities.dto';
import { ReportFilterDto } from '../dtos/report-filter.dto';

@UseGuards(HttpAccessTokenGuard)
@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @HttpCode(HttpStatus.NO_CONTENT)
  @UseInterceptors(FilesInterceptor('files'))
  @Post()
  async create(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }), // 10 MB
          new FileTypeValidator({
            fileType: /(jpeg|jpg|png|gif|pdf|doc|docx)$/,
          }),
        ],
      }),
    )
    files: Express.Multer.File[],
    @Req() req: Request,
    @Body() reportData: CreateReportDto,
  ) {
    return await this.reportService.create(
      {
        ...reportData,
        reporterId: req.user.id,
      },
      files,
    );
  }

  @Post('filter')
  async getAll(@Body() reportFilterDto: ReportFilterDto) {
    return await this.reportService.getAll(reportFilterDto);
  }

  @Get('my-reports')
  async getMyReports(@Req() req: Request) {
    return await this.reportService.getMyReports(req.user.id);
  }

  @Get(':reportId')
  async getById(@Param() param: ReportIdDto) {
    return await this.reportService.getById(param);
  }

  @Put(':reportId')
  async updateReport(
    @Param() param: ReportIdDto,
    @Body() updateData: Partial<CreateReportDto>,
  ) {
    return await this.reportService.updateReport(param, updateData);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':reportId')
  async deleteById(@Param() param: ReportIdDto) {
    await this.reportService.deleteById(param);
  }

  @HttpCode(204)
  @Put(':reportId/vote')
  async vote() {}

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
