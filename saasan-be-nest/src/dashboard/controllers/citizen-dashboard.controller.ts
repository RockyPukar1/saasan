import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { DashboardService } from '../services/dashboard.service';
import { HttpAccessTokenGuard } from 'src/common/guards/http-access-token.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/user/entities/user.entity';
import type { Request } from 'express';

import { PermissionGuard } from 'src/common/guards/permission.guard';
import { PERMISSIONS } from 'src/common/constants/permission.constants';
import { Permissions } from 'src/common/decorators/permissions.decorator';

@UseGuards(HttpAccessTokenGuard, RoleGuard, PermissionGuard)
@Roles(UserRole.CITIZEN)
@Controller('citizen/dashboard')
export class CitizenDashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Permissions(PERMISSIONS.dashboard.view)
  @Get('stats')
  async getStats(@Req() req: Request) {
    return this.dashboardService.getCitizenStats(req.user.id);
  }
}
