import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { DashboardService } from '../services/dashboard.service';
import { HttpAccessTokenGuard } from 'src/common/guards/http-access-token.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/user/entities/user.entity';
import { PERMISSIONS } from 'src/common/constants/permission.constants';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { PermissionGuard } from 'src/common/guards/permission.guard';
import type { Request } from 'express';

@UseGuards(HttpAccessTokenGuard, RoleGuard, PermissionGuard)
@Roles(UserRole.POLITICIAN)
@Controller('politician/dashboard')
export class PoliticianDashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Permissions(PERMISSIONS.dashboard.view)
  @Get('stats')
  async getStats(@Req() req: Request) {
    const requestUser = req.user as any;
    return this.dashboardService.getPoliticianStats(
      requestUser.politicianId || requestUser.id,
    );
  }
}
