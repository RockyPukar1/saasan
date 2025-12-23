import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from '../services/dashboard.service';
import { HttpAccessTokenGuard } from 'src/common/guards/http-access-token.guard';

@UseGuards(HttpAccessTokenGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  async getStats() {
    return this.dashboardService.getStats();
  }

  @Get('major-cases')
  async getMajorCases() {
    return this.dashboardService.getMajorCases();
  }

  @Get('live-services')
  async getLiveServices() {
    return this.dashboardService.getLiveServices();
  }
}
