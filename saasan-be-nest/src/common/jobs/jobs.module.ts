import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  JobRecordEntity,
  JobRecordEntitySchema,
} from './entities/job-record.entity';
import { AdminJobController } from './controllers/admin-job.controller';
import { JobRecordRepository } from './repositories/job-record.repository';
import { JobTrackerService } from './services/job-tracker.service';
import { JobRetryService } from './services/job-retry.service';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: JobRecordEntity.name,
        schema: JobRecordEntitySchema,
      },
    ]),
  ],
  controllers: [AdminJobController],
  providers: [JobRecordRepository, JobTrackerService, JobRetryService],
  exports: [JobRecordRepository, JobTrackerService],
})
export class JobsModule {}
