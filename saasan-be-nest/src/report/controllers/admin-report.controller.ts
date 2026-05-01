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
  Req,
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
import type { Request } from 'express';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/user/entities/user.entity';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { PERMISSIONS } from 'src/common/constants/permission.constants';
import { PermissionGuard } from 'src/common/guards/permission.guard';
import { GetReportActivitiesDto } from '../dtos/get-report-activities.dto';

@UseGuards(HttpAccessTokenGuard, RoleGuard, PermissionGuard)
@Roles(UserRole.ADMIN)
@Controller('admin/report')
export class AdminReportController {
  constructor(private readonly reportService: ReportService) {}

  @Permissions(PERMISSIONS.reports.view)
  @Post('filter')
  async getAll(@Body() reportFilterDto: ReportFilterDto) {
    return await this.reportService.getAll(reportFilterDto);
  }

  @Permissions(PERMISSIONS.reports.resolve)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Put(':reportId')
  async adminUpdateReport(
    @Param() param: ReportIdDto,
    @Body() updateData: AdminUpdateReportDto,
    @Req() req: Request,
  ) {
    await this.reportService.adminUpdateReport(param, req.user.id, updateData);
  }

  @Permissions(PERMISSIONS.reports.view)
  @Get(':reportId/politician-suggestions')
  async getPoliticianSuggestions(@Param() param: ReportIdDto) {
    return await this.reportService.getApprovalSuggestions(param.reportId);
  }

  @Permissions(PERMISSIONS.reports.view)
  @Get('activities/recent')
  async getRecentActivities(@Query('limit') limit?: string) {
    const parsedLimit = limit ? parseInt(limit, 10) : undefined;
    return await this.reportService.getRecentActivities(parsedLimit);
  }

  @Permissions(PERMISSIONS.reports.view)
  @Get(':reportId/activities')
  async getReportActivities(
    @Param() param: ReportIdDto,
    @Query() query: GetReportActivitiesDto,
  ) {
    return await this.reportService.getActivities(
      param.reportId,
      query.page,
      query.limit,
    );
  }

  @Permissions(PERMISSIONS.reports.resolve)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post(':reportId/reject')
  async rejectReport(
    @Param() param: ReportIdDto,
    @Req() req: Request,
    @Body('comment') comment?: string,
  ) {
    await this.reportService.reject(param.reportId, req.user.id, comment);
  }

  @Permissions(PERMISSIONS.reports.resolve)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post(':reportId/resolve')
  async resolveReport(
    @Param() param: ReportIdDto,
    @Req() req: Request,
    @Body('comment') comment?: string,
  ) {
    await this.reportService.resolve(param.reportId, req.user.id, comment);
  }

  // Report Types CRUD
  @Permissions(PERMISSIONS.reports.types.view)
  @Get('types')
  async getReportTypes() {
    return await this.reportService.getReportTypes();
  }

  @Permissions(PERMISSIONS.reports.types.create)
  @Post('types')
  @HttpCode(201)
  async createReportType(@Body() createReportTypeDto: CreateReportTypeDto) {
    return await this.reportService.createReportType(createReportTypeDto);
  }

  @Permissions(PERMISSIONS.reports.types.update)
  @Put('types/:id')
  async updateReportType(
    @Param('id') id: string,
    @Body() updateData: CreateReportTypeDto,
  ) {
    return await this.reportService.updateReportType(id, updateData);
  }

  @Permissions(PERMISSIONS.reports.types.delete)
  @HttpCode(204)
  @Delete('types/:id')
  async deleteReportType(@Param('id') id: string) {
    return await this.reportService.deleteReportType(id);
  }

  // Report Statuses CRUD
  @Permissions(PERMISSIONS.reports.statuses.view)
  @Get('statuses')
  async getReportStatuses() {
    return await this.reportService.getReportStatuses();
  }

  @Permissions(PERMISSIONS.reports.statuses.create)
  @Post('statuses')
  @HttpCode(201)
  async createReportStatus(
    @Body() createReportStatusDto: CreateReportStatusDto,
  ) {
    return await this.reportService.createReportStatus(createReportStatusDto);
  }

  @Permissions(PERMISSIONS.reports.statuses.update)
  @Put('statuses/:id')
  async updateReportStatus(
    @Param('id') id: string,
    @Body() updateData: CreateReportStatusDto,
  ) {
    return await this.reportService.updateReportStatus(id, updateData);
  }

  @Permissions(PERMISSIONS.reports.statuses.delete)
  @HttpCode(204)
  @Delete('statuses/:id')
  async deleteReportStatus(@Param('id') id: string) {
    return await this.reportService.deleteReportStatus(id);
  }

  // Report Priorities CRUD
  @Permissions(PERMISSIONS.reports.priorities.view)
  @Get('priorities')
  async getReportPriorities() {
    return await this.reportService.getReportPriorities();
  }

  @Permissions(PERMISSIONS.reports.priorities.create)
  @Post('priorities')
  @HttpCode(201)
  async createReportPriority(
    @Body() createReportPriorityDto: CreateReportPriorityDto,
  ) {
    return await this.reportService.createReportPriority(
      createReportPriorityDto,
    );
  }

  @Permissions(PERMISSIONS.reports.priorities.update)
  @Put('priorities/:id')
  async updateReportPriority(
    @Param('id') id: string,
    @Body() updateData: CreateReportPriorityDto,
  ) {
    return await this.reportService.updateReportPriority(id, updateData);
  }

  @Permissions(PERMISSIONS.reports.priorities.delete)
  @HttpCode(204)
  @Delete('priorities/:id')
  async deleteReportPriority(@Param('id') id: string) {
    return await this.reportService.deleteReportPriority(id);
  }

  // Report Visibilities CRUD
  @Permissions(PERMISSIONS.reports.visibilities.view)
  @Get('visibilities')
  async getReportVisibilities() {
    return await this.reportService.getReportVisibilities();
  }

  @Permissions(PERMISSIONS.reports.visibilities.create)
  @Post('visibilities')
  @HttpCode(201)
  async createReportVisibility(
    @Body() createReportVisibilityDto: CreateReportVisibilityDto,
  ) {
    return await this.reportService.createReportVisibility(
      createReportVisibilityDto,
    );
  }

  @Permissions(PERMISSIONS.reports.visibilities.update)
  @Put('visibilities/:id')
  async updateReportVisibility(
    @Param('id') id: string,
    @Body() updateData: CreateReportVisibilityDto,
  ) {
    return await this.reportService.updateReportVisibility(id, updateData);
  }

  @Permissions(PERMISSIONS.reports.visibilities.delete)
  @HttpCode(204)
  @Delete('visibilities/:id')
  async deleteReportVisibility(@Param('id') id: string) {
    return await this.reportService.deleteReportVisibility(id);
  }
}
