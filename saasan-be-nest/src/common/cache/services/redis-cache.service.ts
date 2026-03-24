import { Inject, Injectable, Logger } from '@nestjs/common';
import { type Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class RedisCacheService {
  private readonly logger = new Logger(RedisCacheService.name);

  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async get<T>(key: string): Promise<T | undefined> {
    const value = await this.cacheManager.get<T>(key);
    if (value === null || value === undefined) {
      return;
    }
    this.logger.log(`Redis cache hit for ${key}`);
    return value;
  }

  async set<T>(
    key: string,
    value: T,
    ttl: number = 10 * 86400 * 1000,
  ): Promise<void> {
    await this.cacheManager.set(key, value, ttl);
  }

  async del(key: string): Promise<void> {
    await this.cacheManager.del(key);
  }

  async reset(): Promise<void> {
    await this.cacheManager.clear();
  }
}
