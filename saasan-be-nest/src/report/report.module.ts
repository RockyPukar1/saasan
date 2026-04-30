import { forwardRef, Module } from '@nestjs/common';
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
import { ReportToMessageService } from './services/report-to-message.service';
import { PoliticsModule } from 'src/politics/politics.module';
import { MessageModule } from 'src/message/message.module';
import { FileModule } from 'src/common/file/file.module';
import {
  ReportVoteEntity,
  ReportVoteEntitySchema,
} from './entities/report-vote.entity';
import { ReportVoteRepository } from './repositories/report-vote.repository';
import {
  ReportDiscussionCommentEntity,
  ReportDiscussionCommentEntitySchema,
} from './entities/report-discussion-comment.entity';
import {
  ReportDiscussionParticipantEntity,
  ReportDiscussionParticipantEntitySchema,
} from './entities/report-discussion-participant.entity';
import {
  ReportDiscussionCommentVoteEntity,
  ReportDiscussionCommentVoteEntitySchema,
} from './entities/report-discussion-comment-vote.entity';
import { ReportDiscussionCommentRepository } from './repositories/report-discussion-comment.repository';
import { ReportDiscussionParticipantRepository } from './repositories/report-discussion-participant.repository';
import { ReportDiscussionCommentVoteRepository } from './repositories/report-discussion-comment-vote.repository';
import { ReportDiscussionService } from './services/report-discussion.service';

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
      { name: ReportVoteEntity.name, schema: ReportVoteEntitySchema },
      {
        name: ReportDiscussionCommentEntity.name,
        schema: ReportDiscussionCommentEntitySchema,
      },
      {
        name: ReportDiscussionParticipantEntity.name,
        schema: ReportDiscussionParticipantEntitySchema,
      },
      {
        name: ReportDiscussionCommentVoteEntity.name,
        schema: ReportDiscussionCommentVoteEntitySchema,
      },
    ]),
    CloudinaryModule,
    TransactionModule,
    PoliticsModule,
    MessageModule,
    FileModule,
  ],
  controllers: [
    ReportController,
    ReportEvidenceController,
    AdminReportController,
  ],
  providers: [
    ReportService,
    EvidenceService,
    ReportRepository,
    EvidenceRepository,
    ReportActivityRepository,
    ReportTypeRepository,
    ReportStatusRepository,
    ReportPriorityRepository,
    ReportVisibilityRepository,
    ReportVoteRepository,
    ReportToMessageService,
    ReportDiscussionCommentRepository,
    ReportDiscussionParticipantRepository,
    ReportDiscussionCommentVoteRepository,
    ReportDiscussionService,
  ],
  exports: [
    ReportRepository,
    ReportTypeRepository,
    ReportStatusRepository,
    ReportPriorityRepository,
    ReportVisibilityRepository,
    ReportVoteRepository,
  ],
})
export class ReportModule {}
