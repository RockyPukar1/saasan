import { forwardRef, Module } from '@nestjs/common';
import { DashboardController } from './controllers/dashboard.controller';
import { DashboardService } from './services/dashboard.service';
import { ReportModule } from 'src/report/report.module';
import { PoliticsModule } from 'src/politics/politics.module';
import { EventModule } from 'src/event/event.module';
import { CacheModule } from 'src/common/cache/cache.module';
import { CaseModule } from 'src/case/case.module';

@Module({
  imports: [
    ReportModule,
    EventModule,
    PoliticsModule,
    CaseModule,
    forwardRef(() => CacheModule),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {}
