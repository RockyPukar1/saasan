import { Injectable } from '@nestjs/common';
import { ResponseHelper } from 'src/common/helpers/response.helper';
import { PoliticianRepository } from 'src/politics/politician/repositories/politician.repository';
import { ReportRepository } from 'src/report/repositories/report.repository';
import { ServiceRepository } from 'src/service/repositories/service.repository';

@Injectable()
export class DashboardService {
  constructor(
    private readonly reportRepo: ReportRepository,
    private readonly politicianRepo: PoliticianRepository,
    private readonly serviceRepo: ServiceRepository,
  ) {}

  async getStats() {
    const totalReports = await this.reportRepo.getTotalReports();
    const resolvedReports = await this.reportRepo.getResolvedReports();
    const recentReports = await this.reportRepo.getRecentReports();
    const categoryStats = await this.reportRepo.getStatsByCategory();
    const districtStats = await this.reportRepo.getStatsByDistrict();

    const totalPoliticians = await this.politicianRepo.getTotalPoliticians();
    const activePoliticians =
      await this.politicianRepo.getTotalActivePoliticians();

    const stats = {
      overview: {
        totalReports: totalReports || 0,
        resolvedReports: resolvedReports || 0,
        totalPoliticians: totalPoliticians || 0,
        activePoliticians: activePoliticians || 0,
        resolutionRate: totalReports
          ? ((resolvedReports / totalReports) * 100).toFixed(1)
          : 0,
      },
      recentActivity: recentReports,
      categoryBreakdown: categoryStats,
      districtBreakdown: districtStats,
    };
    return ResponseHelper.success(stats);
  }

  async getMajorCases() {
    const majorCases = await this.reportRepo.getMajorCases();

    return ResponseHelper.success(majorCases);
  }

  async getLiveServices() {
    return await this.serviceRepo.getLiveServices();
  }
}
