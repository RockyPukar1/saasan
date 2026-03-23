import { forwardRef, Module } from "@nestjs/common";
import { LocationModule } from "src/location/location.module";
import { PoliticsModule } from "src/politics/politics.module";
import { PollModule } from "src/poll/poll.module";
import { MemoryCacheService } from "./memory-cache.service";
import { CacheWarmupService } from "./cache-warmup.service";
import { DashboardModule } from "src/dashboard/dashboard.module";

@Module({
  imports: [
    forwardRef(() => PollModule),
    forwardRef(() => LocationModule),
    forwardRef(() => PoliticsModule),
    forwardRef(() => DashboardModule),
  ],
  providers: [MemoryCacheService, CacheWarmupService],
  exports: [MemoryCacheService, CacheWarmupService]
})
export class CacheModule {}