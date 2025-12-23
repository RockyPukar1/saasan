import { Module } from '@nestjs/common';
import { DashboardController } from './controllers/dashboard.controller';
import { DashboardService } from './services/dashboard.service';
import { ReportModule } from 'src/report/report.module';
import { PoliticianModule } from 'src/politician/politician.module';
import { ServiceModule } from 'src/service/service.module';

@Module({
  imports: [ReportModule, PoliticianModule, ServiceModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
