import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PollRepository } from 'src/poll/repositories/poll.repository';
import { ProvinceRepository } from 'src/location/province/repositories/province.repository';
import { DistrictRepository } from 'src/location/district/repositories/district.repository';
import { MunicipalityRepository } from 'src/location/municipality/repositories/municipality.repository';
import { WardRepository } from 'src/location/ward/repositories/ward.repository';
import { PartyRepository } from 'src/politics/party/repositories/party.repository';
import { LevelRepository } from 'src/politics/level/repositories/level.repository';
import { PositionRepository } from 'src/politics/position/repositories/position.repository';
import { DashboardService } from 'src/dashboard/services/dashboard.service';
import { RedisCacheService } from './redis-cache.service';
import { ReportTypeRepository } from 'src/report/repositories/report-type.repository';
import { ReportStatusRepository } from 'src/report/repositories/report-status.repository';
import { ReportPriorityRepository } from 'src/report/repositories/report-priority.repository';
import { ReportVisibilityRepository } from 'src/report/repositories/report-visibility.repository';

@Injectable()
export class CacheWarmupService implements OnModuleInit {
  private readonly logger = new Logger(CacheWarmupService.name);

  constructor(
    private readonly redisCache: RedisCacheService,
    private readonly pollRepository: PollRepository,
    private readonly dashboardService: DashboardService,
    private readonly provinceRepository: ProvinceRepository,
    private readonly districtRepository: DistrictRepository,
    private readonly municipalityRepository: MunicipalityRepository,
    private readonly wardRepository: WardRepository,
    private readonly partyRepository: PartyRepository,
    private readonly levelRepository: LevelRepository,
    private readonly positionRepository: PositionRepository,
    private readonly reportTypeRepo: ReportTypeRepository,
    private readonly reportStatusRepo: ReportStatusRepository,
    private readonly reportPriorityRepo: ReportPriorityRepository,
    private readonly reportVisibilityRepo: ReportVisibilityRepository,
  ) {}

  async onModuleInit() {
    this.logger.log('Starting cache warm-up');
    await this.warmupCache();
    this.logger.log('Cache warm-up completed');
  }

  private async warmupCache() {
    await Promise.all([
      this.warmupDashboardStats(),
      this.warmupPollData(),
      this.warmupLocationData(),
      this.warmupPoliticsData(),
      this.warmupReportsData(),
    ]);
  }

  private async warmupDashboardStats() {
    await this.dashboardService.getStats();
    this.logger.log('Warmed up dashboard stats');
  }

  private async warmupPollData() {
    const [categories, statuses, types] = await Promise.all([
      this.pollRepository.getCategories(),
      this.pollRepository.getStatuses(),
      this.pollRepository.getTypes(),
    ]);

    await this.redisCache.set('polls:categories', categories);
    await this.redisCache.set('polls:statuses', statuses);
    await this.redisCache.set('polls:types', types);

    this.logger.log(
      `Warmed up poll data: ${categories.length} categories, ${statuses.length} statuses, ${types.length} types`,
    );
  }

  private async warmupLocationData() {
    const page = 1;
    const limit = 10;
    const [provinces, districts, municipalities, wards] = await Promise.all([
      this.provinceRepository.find({ page, limit }),
      this.districtRepository.find({ page, limit }),
      this.municipalityRepository.find({ page, limit }),
      this.wardRepository.find({ page, limit }),
    ]);

    await this.redisCache.set(`location:provinces:${page}:${limit}`, provinces);
    await this.redisCache.set(`location:districts:${page}:${limit}`, districts);
    await this.redisCache.set(
      `location:municipalities:${page}:${limit}`,
      municipalities,
    );
    await this.redisCache.set(`location:wards:${page}:${limit}`, wards);

    this.logger.log(
      `Warmed up location data: ${provinces.data.length} provinces, ${districts.data.length} districts, ${municipalities.data.length} municipalities, ${wards.data.length} wards`,
    );
  }

  private async warmupPoliticsData() {
    const [parties, levels, positions] = await Promise.all([
      this.partyRepository.getParties(),
      this.levelRepository.getLevels(),
      this.positionRepository.getPositions(),
    ]);

    await this.redisCache.set('politics:parties', parties);
    await this.redisCache.set('politics:levels', levels);
    await this.redisCache.set('politics:positions', positions);

    this.logger.log(
      `Warmed up politics data: ${parties.length} parties, ${levels.length} levels, ${positions.length} positions`,
    );
  }

  private async warmupReportsData() {
    const [types, statuses, priorities, visibilities] = await Promise.all([
      this.reportTypeRepo.findAll(),
      this.reportStatusRepo.findAll(),
      this.reportPriorityRepo.findAll(),
      this.reportVisibilityRepo.findAll(),
    ]);

    await this.redisCache.set('reports:types', types);
    await this.redisCache.set('reports:statuses', statuses);
    await this.redisCache.set('reports:priorities', priorities);
    await this.redisCache.set('reports:visibilities', visibilities);

    this.logger.log(
      `Warmed up reports data: ${types.length} types, ${statuses.length} statuses, ${priorities.length} priorities, ${visibilities.length} visibilities`,
    );
  }
}
