import { Injectable, Logger } from '@nestjs/common';
import { JobTrackerService } from './job-tracker.service';
import { KafkaService } from 'src/common/kafka/services/kafka.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class JobRetryService {
  private readonly logger = new Logger(JobRetryService.name);

  constructor(
    private readonly jobTracker: JobTrackerService,
    private readonly kafkaService: KafkaService,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async retryDueJobs() {
    const jobs = await this.jobTracker.getDueRetries();

    for (const job of jobs) {
      try {
        await this.jobTracker.markPendingForRetry({
          jobId: job._id.toString(),
        });
        await this.kafkaService.emit(job.topic, job.payload);
      } catch (error) {
        this.logger.error(
          `Failed to republish retry job ${job.jobKey}`,
          error instanceof Error ? error.stack : String(error),
        );
      }
    }
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async republishStalePendingJobs() {
    const jobs = await this.jobTracker.getStalePendingJobs();

    for (const job of jobs) {
      try {
        this.logger.warn(
          `Republishing stale pending job ${job.jobKey} topic=${job.topic}`,
        );
        await this.kafkaService.emit(job.topic, job.payload);
      } catch (error) {
        this.logger.error(
          `Failed to republish stale pending job ${job.jobKey}`,
          error instanceof Error ? error.stack : String(error),
        );
      }
    }
  }
}
