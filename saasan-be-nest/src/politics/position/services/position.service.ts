import { Injectable, Logger } from '@nestjs/common';
import { ResponseHelper } from 'src/common/helpers/response.helper';
import { PositionRepository } from '../repositories/position.repository';
import { PositionSerializer } from '../serializers/positions.serializer';
import { MemoryCacheService } from 'src/common/cache/memory-cache.service';

@Injectable()
export class PositionService {
  private readonly logger = new Logger(PositionService.name);
  
  constructor(
    private readonly positionRepo: PositionRepository,
    private readonly memoryCache: MemoryCacheService,
  ) {}

  async getPositions() {
    const cacheKey = 'politics:positions';

    const cached = this.memoryCache.get(cacheKey);
    if (cached) {
      this.logger.log(`Cache hit for ${cacheKey}`);

      return ResponseHelper.response(
        PositionSerializer,
        cached,
        'Positions fetched successfully',
      );
    }
    
    const position = await this.positionRepo.getPositions();

    this.memoryCache.set(cacheKey, position, 7200);
    
    return ResponseHelper.response(
      PositionSerializer,
      position,
      'Positions fetched successfully',
    );
  }
}
