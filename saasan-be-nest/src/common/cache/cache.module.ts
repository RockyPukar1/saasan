import { Global, Module } from '@nestjs/common';
import { LocationModule } from 'src/location/location.module';
import { PoliticsModule } from 'src/politics/politics.module';
import { PollModule } from 'src/poll/poll.module';
import { CacheWarmupService } from './services/cache-warmup.service';
import { DashboardModule } from 'src/dashboard/dashboard.module';
import { RedisCacheService } from './services/redis-cache.service';
import { ReportModule } from 'src/report/report.module';
import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';
import KeyvRedis from '@keyv/redis';

@Global()
@Module({
  imports: [
    PollModule,
    LocationModule,
    PoliticsModule,
    DashboardModule,
    ReportModule,
    NestCacheModule.registerAsync({
      useFactory: async () => {
        const host = process.env.SAASAN_REDIS_HOST || 'localhost';
        const port = process.env.SAASAN_REDIS_PORT || 6379;
        const password = process.env.SAASAN_REDIS_PASSWORD;
        const db = Number(process.env.SAASAN_REDIS_DB || 0);
        const namespace = process.env.SAASAN_REDIS_KEY_PREFIX || 'saasan:';

        const authPart = password ? `:${encodeURIComponent(password)}@` : '';
        const redisUrl = `redis://${authPart}${host}:${port}/${db}`;

        return {
          stores: [
            new KeyvRedis(redisUrl, {
              namespace,
            }),
          ],
        };
      },
    }),
  ],
  providers: [CacheWarmupService, RedisCacheService],
  exports: [CacheWarmupService, RedisCacheService],
})
export class CacheModule {}
