import { Injectable, Logger } from '@nestjs/common';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { paginateArrayByCursor } from 'src/common/helpers/cursor-pagination.helper';
import { ResponseHelper } from 'src/common/helpers/response.helper';
import { PositionRepository } from '../repositories/position.repository';
import { PositionSerializer } from '../serializers/positions.serializer';
import { RedisCacheService } from 'src/common/cache/services/redis-cache.service';

@Injectable()
export class PositionService {
  private readonly logger = new Logger(PositionService.name);

  constructor(
    private readonly positionRepo: PositionRepository,
    private readonly redisCache: RedisCacheService,
  ) {}

  async getPositions({ cursor, limit }: PaginationQueryDto) {
    const cacheKey = 'politics:positions';

    const cached = await this.redisCache.get(cacheKey);
    if (cached) {
      const cachedPositions = cached as any[];
      return ResponseHelper.response(
        PositionSerializer,
        paginateArrayByCursor(cachedPositions, cursor, limit),
        'Positions fetched successfully',
      );
    }

    const position = await this.positionRepo.getPositions();

    await this.redisCache.set(cacheKey, position);

    return ResponseHelper.response(
      PositionSerializer,
      paginateArrayByCursor(position, cursor, limit),
      'Positions fetched successfully',
    );
  }
}
