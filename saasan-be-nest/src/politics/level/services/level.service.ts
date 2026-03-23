import { Injectable, Logger } from '@nestjs/common';
import { LevelRepository } from '../repositories/level.repository';
import { ResponseHelper } from 'src/common/helpers/response.helper';
import { LevelSerializer } from '../serializers/level.serializer';
import { MemoryCacheService } from 'src/common/cache/memory-cache.service';

@Injectable()
export class LevelService {
  private readonly logger = new Logger(LevelService.name);
  
  constructor(
    private readonly levelRepo: LevelRepository,
    private readonly memoryCache: MemoryCacheService,
  ) {}

  async getLevels() {
    const cacheKey = "politics:levels";
    
    const cached = await this.memoryCache.get(cacheKey);
    if (cached) {
      this.logger.log(`Cache hit for ${cacheKey}`);
      return ResponseHelper.response(
        LevelSerializer,
        cached,
        'Levels fetched successfully',
      );
    }
    
    const levels = await this.levelRepo.getLevels();

    this.memoryCache.set(cacheKey, levels, 7200);
    
    return ResponseHelper.response(
      LevelSerializer,
      levels,
      'Levels fetched successfully',
    );
  }
}
