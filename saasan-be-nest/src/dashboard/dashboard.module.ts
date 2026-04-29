import { Module } from '@nestjs/common';
import { AdminDashboardController } from './controllers/admin-dashboard.controller';
import { CitizenDashboardController } from './controllers/citizen-dashboard.controller';
import { PoliticianDashboardController } from './controllers/politician-dashboard.controller';
import { DashboardService } from './services/dashboard.service';
import { ReportModule } from 'src/report/report.module';
import { PoliticsModule } from 'src/politics/politics.module';
import { EventModule } from 'src/event/event.module';
import { CaseModule } from 'src/case/case.module';
import { MessageModule } from 'src/message/message.module';

@Module({
  imports: [
    ReportModule,
    EventModule,
    PoliticsModule,
    CaseModule,
    MessageModule,
  ],
  controllers: [
    AdminDashboardController,
    CitizenDashboardController,
    PoliticianDashboardController,
  ],
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {}
