import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ReportService } from '../services/report.service';
import { HttpAccessTokenGuard } from 'src/common/guards/http-access-token.guard';
import { ReportIdDto } from '../dtos/report-id.dto';
import { AdminUpdateReportDto } from '../dtos/admin-update-report.dto';
import { CreateReportTypeDto } from '../dtos/create-report-type.dto';
import { CreateReportStatusDto } from '../dtos/create-report-status.dto';
import { CreateReportPriorityDto } from '../dtos/create-report-priority.dto';
import { CreateReportVisibilityDto } from '../dtos/create-report-visibility.dto';
import { ReportFilterDto } from '../dtos/report-filter.dto';

@UseGuards(HttpAccessTokenGuard)
@Controller('admin/report')
export class AdminReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post('filter')
  async getAll(@Body() reportFilterDto: ReportFilterDto) {
    return await this.reportService.getAll(reportFilterDto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Put(':reportId')
  async adminUpdateReport(
    @Param() param: ReportIdDto,
    @Body() updateData: AdminUpdateReportDto,
  ) {
    await this.reportService.adminUpdateReport(param, updateData);
  }

  // @Get(':reportId/activities')
  // async adminGetReportActivities(
  //   @Param() param: ReportIdDto,
  //   @Query() query: GetReportActivitiesDto,
  // ) {
  //   return await this.reportService.getReportActivities(
  //     param.reportId,
  //     query.page,
  //     query.limit,
  //   );
  // }

  // @Get('activities/recent')
  // async adminGetRecentActivities(@Query('limit') limit?: string) {
  //   return await this.reportService.getRecentActivities(
  //     limit ? parseInt(limit) : undefined,
  //   );
  // }

  // @HttpCode(204)
  // @Post(':reportId/approve')
  // async approve() {}

  // @HttpCode(204)
  // @Post(':reportId/reject')
  // async reject() {}

  @HttpCode(204)
  @Post(':reportId/resolve')
  async resolve() {}

  // Report Types CRUD
  @Get('types')
  async getReportTypes() {
    return await this.reportService.getReportTypes();
  }

  @Post('types')
  @HttpCode(201)
  async createReportType(@Body() createReportTypeDto: CreateReportTypeDto) {
    return await this.reportService.createReportType(createReportTypeDto);
  }

  @Put('types/:id')
  async updateReportType(
    @Param('id') id: string,
    @Body() updateData: CreateReportTypeDto,
  ) {
    return await this.reportService.updateReportType(id, updateData);
  }

  @HttpCode(204)
  @Delete('types/:id')
  async deleteReportType(@Param('id') id: string) {
    return await this.reportService.deleteReportType(id);
  }

  // Report Statuses CRUD
  @Get('statuses')
  async getReportStatuses() {
    return await this.reportService.getReportStatuses();
  }

  @Post('statuses')
  @HttpCode(201)
  async createReportStatus(
    @Body() createReportStatusDto: CreateReportStatusDto,
  ) {
    return await this.reportService.createReportStatus(createReportStatusDto);
  }

  @Put('statuses/:id')
  async updateReportStatus(
    @Param('id') id: string,
    @Body() updateData: CreateReportStatusDto,
  ) {
    return await this.reportService.updateReportStatus(id, updateData);
  }

  @HttpCode(204)
  @Delete('statuses/:id')
  async deleteReportStatus(@Param('id') id: string) {
    return await this.reportService.deleteReportStatus(id);
  }

  // Report Priorities CRUD
  @Get('priorities')
  async getReportPriorities() {
    return await this.reportService.getReportPriorities();
  }

  @Post('priorities')
  @HttpCode(201)
  async createReportPriority(
    @Body() createReportPriorityDto: CreateReportPriorityDto,
  ) {
    return await this.reportService.createReportPriority(
      createReportPriorityDto,
    );
  }

  @Put('priorities/:id')
  async updateReportPriority(
    @Param('id') id: string,
    @Body() updateData: CreateReportPriorityDto,
  ) {
    return await this.reportService.updateReportPriority(id, updateData);
  }

  @HttpCode(204)
  @Delete('priorities/:id')
  async deleteReportPriority(@Param('id') id: string) {
    return await this.reportService.deleteReportPriority(id);
  }

  // Report Visibilities CRUD
  @Get('visibilities')
  async getReportVisibilities() {
    return await this.reportService.getReportVisibilities();
  }

  @Post('visibilities')
  @HttpCode(201)
  async createReportVisibility(
    @Body() createReportVisibilityDto: CreateReportVisibilityDto,
  ) {
    return await this.reportService.createReportVisibility(
      createReportVisibilityDto,
    );
  }

  @Put('visibilities/:id')
  async updateReportVisibility(
    @Param('id') id: string,
    @Body() updateData: CreateReportVisibilityDto,
  ) {
    return await this.reportService.updateReportVisibility(id, updateData);
  }

  @HttpCode(204)
  @Delete('visibilities/:id')
  async deleteReportVisibility(@Param('id') id: string) {
    return await this.reportService.deleteReportVisibility(id);
  }
}
