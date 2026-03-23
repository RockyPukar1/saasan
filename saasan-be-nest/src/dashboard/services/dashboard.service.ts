import { Injectable, Logger } from '@nestjs/common';
import { CaseRepository } from 'src/case/repositories/case.repository';
import { MemoryCacheService } from 'src/common/cache/memory-cache.service';
import { ResponseHelper } from 'src/common/helpers/response.helper';
import { EventRepository } from 'src/event/repositories/event.repository';
import { PoliticianRepository } from 'src/politics/politician/repositories/politician.repository';
import { ReportRepository } from 'src/report/repositories/report.repository';

@Injectable()
export class DashboardService {
  private readonly logger = new Logger(DashboardService.name);
  
  constructor(
    private readonly reportRepo: ReportRepository,
    private readonly caseRepo: CaseRepository,
    private readonly eventRepo: EventRepository,
    private readonly politicianRepo: PoliticianRepository,
    private readonly memoryCache: MemoryCacheService,
  ) {}

  async getStats() {
    const cacheKey = "dashboard:stats";

    const cached = this.memoryCache.get(cacheKey);
    if (cached) {
      this.logger.log(`Cache hit for ${cacheKey}`)
      return ResponseHelper.success(cached);
    }
    
    const totalReportsCount = await this.reportRepo.getTotalReportsCount();
    const totalCasesCount = await this.caseRepo.getTotalCasesCount();
    const resolvedReportsCount =
      await this.reportRepo.getResolvedReportsCount();
    const resolvedCasesCount = await this.caseRepo.getResolvedCasesCount();
    const recentReports = await this.reportRepo.getRecentReports();
    const recentCases = await this.caseRepo.getRecentCases();
    const recentEvents = await this.eventRepo.getRecentEvents();
    const totalPoliticians = await this.politicianRepo.getTotalPoliticians();
    const activePoliticians =
      await this.politicianRepo.getTotalActivePoliticians();
    const eventsOnThisDay = await this.eventRepo.getEventsOnThisDay();

    const stats = {
      overview: {
        totalReportsCount: totalReportsCount || 0,
        resolvedReports: resolvedReportsCount || 0,
        totalCasesCount: totalCasesCount || 0,
        resolvedCasesCount: resolvedCasesCount || 0,
        totalPoliticians: totalPoliticians || 0,
        activePoliticians: activePoliticians || 0,
        reportResolutionRate: totalReportsCount
          ? ((resolvedReportsCount / totalReportsCount) * 100).toFixed(1)
          : 0,
        caseResolutionRate: totalCasesCount
          ? ((resolvedCasesCount / totalCasesCount) * 100).toFixed(1)
          : 0,
      },
      recentReports,
      recentCases,
      recentEvents,
      eventsOnThisDay,
    };

    this.memoryCache.set(cacheKey, stats, 120);
    
    return ResponseHelper.success(stats);
  }
}
