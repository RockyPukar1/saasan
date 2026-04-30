import { Injectable, Logger } from '@nestjs/common';
import { CaseRepository } from 'src/case/repositories/case.repository';
import { RedisCacheService } from 'src/common/cache/services/redis-cache.service';
import { ResponseHelper } from 'src/common/helpers/response.helper';
import { EventRepository } from 'src/event/repositories/event.repository';
import { MessageStatus } from 'src/message/entities/message.entity';
import { MessageRepository } from 'src/message/repositories/message.repository';
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
    private readonly messageRepo: MessageRepository,
    private readonly redisCache: RedisCacheService,
  ) {}

  async getStats() {
    return this.getAdminStats();
  }

  async getAdminStats() {
    const cacheKey = 'dashboard:stats';

    const cached = await this.redisCache.get(cacheKey);
    if (cached) {
      return ResponseHelper.success(cached);
    }

    const [
      totalReportsCount,
      totalCasesCount,
      resolvedReportsCount,
      resolvedCasesCount,
      recentReports,
      recentCases,
      recentEvents,
      totalPoliticians,
      activePoliticians,
      eventsOnThisDay,
      reportLevelBreakdown,
      reportStatusBreakdown,
      reportVolumeTrend,
      caseVolumeTrend,
      eventCategoryBreakdown,
    ] = await Promise.all([
      this.reportRepo.getTotalReportsCount(),
      this.caseRepo.getTotalCasesCount(),
      this.reportRepo.getResolvedReportsCount(),
      this.caseRepo.getResolvedCasesCount(),
      this.reportRepo.getRecentReports(),
      this.caseRepo.getRecentCases(),
      this.eventRepo.getRecentEvents(),
      this.politicianRepo.getTotalPoliticians(),
      this.politicianRepo.getTotalActivePoliticians(),
      this.eventRepo.getEventsOnThisDay(),
      this.reportRepo.getLevelBreakdown(),
      this.reportRepo.getStatusBreakdown(),
      this.reportRepo.getVolumeTrend(7),
      this.caseRepo.getVolumeTrend(7),
      this.eventRepo.getCategoryBreakdown(),
    ]);

    const combinedTrend = this.mergeTrendSeries(
      reportVolumeTrend,
      caseVolumeTrend,
    );

    const stats = {
      overview: {
        totalReportsCount: totalReportsCount || 0,
        resolvedReportsCount: resolvedReportsCount || 0,
        totalCasesCount: totalCasesCount || 0,
        resolvedCasesCount: resolvedCasesCount || 0,
        totalPoliticians: totalPoliticians || 0,
        activePoliticians: activePoliticians || 0,
        reportResolutionRate: totalReportsCount
          ? Number(((resolvedReportsCount / totalReportsCount) * 100).toFixed(1))
          : 0,
        caseResolutionRate: totalCasesCount
          ? Number(((resolvedCasesCount / totalCasesCount) * 100).toFixed(1))
          : 0,
      },
      aggregations: {
        reportLevelBreakdown,
        reportStatusBreakdown,
        reportVolumeTrend,
        caseVolumeTrend,
        combinedVolumeTrend: combinedTrend,
        eventCategoryBreakdown,
      },
      recentReports,
      recentCases,
      recentEvents,
      eventsOnThisDay,
    };

    await this.redisCache.set(cacheKey, stats, 60 * 1000); // 1 minute

    return ResponseHelper.success(stats);
  }

  async getCitizenStats(citizenId: string) {
    const cacheKey = `dashboard:citizen:${citizenId}`;
    const cached = await this.redisCache.get(cacheKey);
    if (cached) {
      return ResponseHelper.success(cached);
    }

    const [
      totalReportsCount,
      resolvedReportsCount,
      totalPoliticians,
      activePoliticians,
      myReports,
      recentReports,
      recentEvents,
      eventsOnThisDay,
    ] = await Promise.all([
      this.reportRepo.getTotalReportsCount(),
      this.reportRepo.getResolvedReportsCount(),
      this.politicianRepo.getTotalPoliticians(),
      this.politicianRepo.getTotalActivePoliticians(),
      this.reportRepo.getMyReports(citizenId, citizenId),
      this.reportRepo.getRecentReports(citizenId),
      this.eventRepo.getRecentEvents(),
      this.eventRepo.getEventsOnThisDay(),
    ]);

    const myReportsCount = myReports.length;
    const myResolvedReportsCount = myReports.filter(
      (report) => report.isResolved,
    ).length;

    const stats = {
      overview: {
        myReportsCount,
        myResolvedReportsCount,
        totalPublicReportsCount: totalReportsCount || 0,
        totalPoliticians: totalPoliticians || 0,
        activePoliticians: activePoliticians || 0,
        myReportResolutionRate: myReportsCount
          ? Number(((myResolvedReportsCount / myReportsCount) * 100).toFixed(1))
          : 0,
      },
      myRecentReports: myReports
        .sort((a, b) => {
          const left = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const right = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return right - left;
        })
        .slice(0, 5),
      publicFeed: {
        recentReports,
        recentEvents,
        eventsOnThisDay,
      },
      community: {
        resolvedPublicReportsCount: resolvedReportsCount || 0,
        publicReportResolutionRate: totalReportsCount
          ? Number(
              ((resolvedReportsCount / totalReportsCount) * 100).toFixed(1),
            )
          : 0,
      },
    };

    await this.redisCache.set(cacheKey, stats, 60 * 1000);
    return ResponseHelper.success(stats);
  }

  async getPoliticianStats(politicianId: string) {
    const cacheKey = `dashboard:politician:${politicianId}`;
    const cached = await this.redisCache.get(cacheKey);
    if (cached) {
      return ResponseHelper.success(cached);
    }

    const messages = await this.messageRepo.findByPoliticianId(politicianId);

    const totalMessages = messages.length;
    const pendingMessages = messages.filter(
      (message) => message.status === MessageStatus.PENDING,
    ).length;
    const inProgressMessages = messages.filter(
      (message) => message.status === MessageStatus.IN_PROGRESS,
    ).length;
    const resolvedMessages = messages.filter(
      (message) =>
        message.status === MessageStatus.RESOLVED ||
        message.status === MessageStatus.CLOSED,
    ).length;
    const reportOriginThreads = messages.filter(
      (message) => message.messageOrigin === 'report_converted',
    ).length;
    const messagesThisWeek = messages.filter((message) => {
      if (!message.createdAt) return false;
      const createdAt = new Date(message.createdAt).getTime();
      const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
      return createdAt >= oneWeekAgo;
    }).length;

    const stats = {
      overview: {
        totalMessages,
        pendingMessages,
        inProgressMessages,
        resolvedMessages,
        reportOriginThreads,
        responseRate: totalMessages
          ? Number(((resolvedMessages / totalMessages) * 100).toFixed(1))
          : 0,
        messagesThisWeek,
      },
      recentMessages: messages.slice(0, 5),
    };

    await this.redisCache.set(cacheKey, stats, 60 * 1000);
    return ResponseHelper.success(stats);
  }

  private mergeTrendSeries(
    reportTrend: Array<{ date: string; count: number }>,
    caseTrend: Array<{ date: string; count: number }>,
  ) {
    const merged = new Map<
      string,
      { date: string; reports: number; cases: number; total: number }
    >();

    for (const item of reportTrend) {
      merged.set(item.date, {
        date: item.date,
        reports: item.count,
        cases: 0,
        total: item.count,
      });
    }

    for (const item of caseTrend) {
      const current = merged.get(item.date) || {
        date: item.date,
        reports: 0,
        cases: 0,
        total: 0,
      };
      current.cases = item.count;
      current.total = current.reports + current.cases;
      merged.set(item.date, current);
    }

    return Array.from(merged.values()).sort((left, right) =>
      left.date.localeCompare(right.date),
    );
  }
}
