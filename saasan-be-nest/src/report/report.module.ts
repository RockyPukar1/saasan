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

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ReportEntity.name, schema: ReportEntitySchema },
      { name: EvidenceEntity.name, schema: EvidenceEntitySchema },
    ]),
    CloudinaryModule,
  ],
  controllers: [ReportController, ReportEvidenceController],
  providers: [
    ReportService,
    EvidenceService,
    ReportRepository,
    EvidenceRepository,
  ],
  exports: [ReportRepository],
})
export class ReportModule {}
