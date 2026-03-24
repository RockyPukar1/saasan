import { Injectable, Logger } from '@nestjs/common';
import { LevelRepository } from '../repositories/level.repository';
import { ResponseHelper } from 'src/common/helpers/response.helper';
import { LevelSerializer } from '../serializers/level.serializer';
import { RedisCacheService } from 'src/common/cache/services/redis-cache.service';

@Injectable()
export class LevelService {
  private readonly logger = new Logger(LevelService.name);

  constructor(
    private readonly levelRepo: LevelRepository,
    private readonly redisCache: RedisCacheService,
  ) {}

  async getLevels() {
    const cacheKey = 'politics:levels';

    const cached = await this.redisCache.get(cacheKey);
    if (cached) {
      return ResponseHelper.response(
        LevelSerializer,
        cached,
        'Levels fetched successfully',
      );
    }

    const levels = await this.levelRepo.getLevels();

    await this.redisCache.set(cacheKey, levels);

    return ResponseHelper.response(
      LevelSerializer,
      levels,
      'Levels fetched successfully',
    );
  }
}
