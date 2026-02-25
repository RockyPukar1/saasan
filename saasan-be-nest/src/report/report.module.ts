import { Module } from '@nestjs/common';
import { ReportEntity, ReportEntitySchema } from './entities/report.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { ReportController } from './controllers/report.controller';
import { ReportService } from './services/report.service';
import { ReportRepository } from './repositories/report.repository';
import { CloudinaryModule } from 'src/common/cloudinary/cloudinary.module';
import {
  EvidenceEntity,
  EvidenceEntitySchema,
} from './entities/evidence.entity';
import { ReportEvidenceController } from './controllers/evidence.controller';
import { EvidenceService } from './services/evidence.service';
import { EvidenceRepository } from './repositories/evidence.repository';
import { TransactionModule } from 'src/common/transaction/transaction.module';
import {
  ReportActivityEntity,
  ReportActivityEntitySchema,
} from './entities/report-activity.entity';
import { ReportActivityService } from './services/report-activity.service';
import { ReportActivityRepository } from './repositories/report-activity.repository';
import { ReportTypeRepository } from './repositories/report-type.repository';
import {
  ReportTypeEntity,
  ReportTypeEntitySchema,
} from './entities/report-type.entity';
import { ReportStatusRepository } from './repositories/report-status.repository';
import {
  ReportStatusEntity,
  ReportStatusEntitySchema,
} from './entities/report-status.entity';
import { ReportVisibilityRepository } from './repositories/report-visibility.repository';
import { ReportPriorityRepository } from './repositories/report-priority.repository';
import {
  ReportPriorityEntity,
  ReportPriorityEntitySchema,
} from './entities/report-priority.entity';
import {
  ReportVisibilityEntity,
  ReportVisibilityEntitySchema,
} from './entities/report-visibility.entity';
import { AdminReportController } from './controllers/admin-report.controller';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ReportEntity.name, schema: ReportEntitySchema },
      { name: EvidenceEntity.name, schema: EvidenceEntitySchema },
      { name: ReportActivityEntity.name, schema: ReportActivityEntitySchema },
      { name: ReportTypeEntity.name, schema: ReportTypeEntitySchema },
      { name: ReportStatusEntity.name, schema: ReportStatusEntitySchema },
      { name: ReportPriorityEntity.name, schema: ReportPriorityEntitySchema },
      {
        name: ReportVisibilityEntity.name,
        schema: ReportVisibilityEntitySchema,
      },
    ]),
    CloudinaryModule,
    TransactionModule,
  ],
  controllers: [
    ReportController,
    ReportEvidenceController,
    AdminReportController,
  ],
  providers: [
    ReportService,
    EvidenceService,
    ReportActivityService,
    ReportRepository,
    EvidenceRepository,
    ReportActivityRepository,
    ReportTypeRepository,
    ReportStatusRepository,
    ReportPriorityRepository,
    ReportVisibilityRepository,
  ],
  exports: [ReportRepository],
})
export class ReportModule {}
