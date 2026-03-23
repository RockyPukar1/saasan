import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { MemoryCacheService } from "./memory-cache.service";
import { PollRepository } from "src/poll/repositories/poll.repository";
import { ProvinceRepository } from "src/location/province/repositories/province.repository";
import { DistrictRepository } from "src/location/district/repositories/district.repository";
import { MunicipalityRepository } from "src/location/municipality/repositories/municipality.repository";
import { WardRepository } from "src/location/ward/repositories/ward.repository";
import { PartyRepository } from "src/politics/party/repositories/party.repository";
import { LevelRepository } from "src/politics/level/repositories/level.repository";
import { PositionRepository } from "src/politics/position/repositories/position.repository";
import { DashboardService } from "src/dashboard/services/dashboard.service";

@Injectable()
export class CacheWarmupService implements OnModuleInit {
  private readonly logger = new Logger(CacheWarmupService.name)

  constructor(
    private readonly memoryCache: MemoryCacheService,
    private readonly pollRepository: PollRepository,
    private readonly dashboardService: DashboardService,
    private readonly provinceRepository: ProvinceRepository,
    private readonly districtRepository: DistrictRepository,
    private readonly municipalityRepository: MunicipalityRepository,
    private readonly wardRepository: WardRepository,
    private readonly partyRepository: PartyRepository,
    private readonly levelRepository: LevelRepository,
    private readonly positionRepository: PositionRepository
  ) {}
  
  async onModuleInit() {
    this.logger.log("Starting cache warm-up");
    await this.warmupCache();
    this.logger.log("Cache warm-up completed")
  }

  private async warmupCache() {
    await Promise.all([
      this.warmupDashboardStats(),
      this.warmupPollData(),
      this.warmupLocationData(),
      this.warmupPoliticsData()
    ])
  }

  private async warmupDashboardStats() {
    const time = 60; // 1 minute
    const stats = await this.dashboardService.getStats();
    this.memoryCache.set("dashboard:stats", stats.data, time);
    this.logger.log("Warmed up dashboard stats");
  }

  private async warmupPollData() {
    const time = 3600; // 1 hour
    const [categories, statuses, types] = await Promise.all([
      this.pollRepository.getCategories(),
      this.pollRepository.getStatuses(),
      this.pollRepository.getTypes(),
    ]);

    this.memoryCache.set("polls:categories", categories, time);
    this.memoryCache.set("polls:statuses", statuses, time);
    this.memoryCache.set("polls:types", types, time);

    this.logger.log(`Warmed up poll data: ${categories.length} categories, ${statuses.length} statuses, ${types.length} types`);
  }

  private async warmupLocationData() {
    const page = 1;
    const limit = 10;
    const time = 7200; // 2 hours
    const [provinces, districts, municipalities, wards] = await Promise.all([
      this.provinceRepository.find({ page, limit }),
      this.districtRepository.find({ page, limit }),
      this.municipalityRepository.find({ page, limit }),
      this.wardRepository.find({ page, limit })
    ]);

    this.memoryCache.set(`location:provinces:${page}:${limit}`, provinces, time);
    this.memoryCache.set(`location:districts:${page}:${limit}`, districts, time);
    this.memoryCache.set(`location:municipalities:${page}:${limit}`, municipalities, time);
    this.memoryCache.set(`location:wards:${page}:${limit}`, wards, time);

    this.logger.log(`Warmed up location data: ${provinces.data.length} provinces, ${districts.data.length} districts, ${municipalities.data.length} municipalities, ${wards.data.length} wards`);
  }

  private async warmupPoliticsData() {
    const [parties, levels, positions] = await Promise.all([
      this.partyRepository.getParties(),
      this.levelRepository.getLevels(),
      this.positionRepository.getPositions(),
    ]);
    
    this.memoryCache.set("politics:parties", parties, 7200);
    this.memoryCache.set("politics:levels", levels, 7200);
    this.memoryCache.set("politics:positions", positions, 7200);
    
    this.logger.log(`Warmed up politics data: ${parties.length} parties, ${levels.length} levels, ${positions.length} positions`);
  }
}