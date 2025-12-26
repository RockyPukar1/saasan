import { Module } from '@nestjs/common';
import { DashboardController } from './controllers/dashboard.controller';
import { DashboardService } from './services/dashboard.service';
import { ReportModule } from 'src/report/report.module';
import { ServiceModule } from 'src/service/service.module';
import { PoliticsModule } from 'src/politics/politics.module';
import { EventModule } from 'src/event/event.module';

@Module({
  imports: [ReportModule, EventModule, PoliticsModule, ServiceModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
