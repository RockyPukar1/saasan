import { Module } from '@nestjs/common';
import { DashboardController } from './controllers/dashboard.controller';
import { DashboardService } from './services/dashboard.service';
import { ReportModule } from '@/report/report.module';
import { ServiceModule } from '@/service/service.module';
import { PoliticsModule } from '@/politics/politics.module';
import { EventModule } from '@/event/event.module';
import { CaseModule } from '@/case/case.module';

@Module({
  imports: [
    ReportModule,
    EventModule,
    PoliticsModule,
    ServiceModule,
    CaseModule,
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
