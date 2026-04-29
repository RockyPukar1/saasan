import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { KafkaService } from 'src/common/kafka/services/kafka.service';
import { FilePublisher } from '../publishers/file.publisher';
import {
  KAFKA_GROUP_FILE,
  KAFKA_TOPIC_FILE,
} from 'src/common/kafka/constants/kafka.constants';
import { FILE_EVENT_TYPES } from '../events/file.events';
import { JobTrackerService } from 'src/common/jobs/services/job-tracker.service';

@Injectable()
export class FileConsumer implements OnModuleInit {
  private readonly logger = new Logger(FileConsumer.name);
  private readonly maxRetries = 3;

  constructor(
    private readonly kafkaService: KafkaService,
    private readonly filePublisher: FilePublisher,
    private readonly jobTracker: JobTrackerService,
  ) {}

  async onModuleInit() {
    this.logger.log('Starting file consumer');

    const consumer = await this.kafkaService.createConsumer(KAFKA_GROUP_FILE);

    if (!consumer) {
      this.logger.warn(
        'File consumer not started because Kafka is unavailable',
      );
      return;
    }

    await consumer.subscribe({
      topic: KAFKA_TOPIC_FILE,
      fromBeginning: false,
    });

    this.logger.log(
      `Email consumer subscribed group=${KAFKA_GROUP_FILE} topic=${KAFKA_TOPIC_FILE}`,
    );

    await consumer.run({
      eachMessage: async ({ topic, message }) => {
        if (!message.value) return;

        const payload = JSON.parse(message.value.toString());

        const canProcess = await this.jobTracker.beginProcessing(
          payload.jobKey,
        );

        if (!canProcess) {
          return;
        }

        try {
          if (payload.type === FILE_EVENT_TYPES.EVIDENCE_UPLOADED) {
            this.logger.log(
              `Processed evidence upload event reportId=${payload.reportId} files=${payload.files.length}`,
            );
          }

          await this.jobTracker.markCompleted(payload.jobKey);
        } catch (error) {
          const retryCount = (payload.retryCount || 0) + 1;
          const reason =
            error instanceof Error ? error.message : 'unknown file event error';

          this.logger.error(
            `Failed processing file event reportId=${payload.reportId} retryCount=${retryCount}`,
            error instanceof Error ? error.stack : String(error),
          );

          if (retryCount < this.maxRetries) {
            await this.jobTracker.scheduleRetry(
              payload.jobKey,
              reason,
              retryCount,
            );
            return;
          }

          await this.jobTracker.markDeadLettered(payload.jobKey, reason);

          await this.filePublisher.publishDeadLetter({
            originalTopic: topic,
            reason,
            payload: {
              ...payload,
              retryCount,
            },
            failedAt: new Date().toISOString(),
          });
        }
      },
    });
  }
}
