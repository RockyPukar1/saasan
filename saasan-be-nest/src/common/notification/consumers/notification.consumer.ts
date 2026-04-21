import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { JobTrackerService } from 'src/common/jobs/services/job-tracker.service';
import {
  KAFKA_GROUP_NOTIFICATION,
  KAFKA_TOPIC_NOTIFICATION,
} from 'src/common/kafka/constants/kafka.constants';
import { KafkaService } from 'src/common/kafka/services/kafka.service';
import { NotificationRepository } from '../repositories/notification.repository';
import { NotificationPublisher } from '../publishers/notification.publisher';

@Injectable()
export class NotificationConsumer implements OnModuleInit {
  private readonly logger = new Logger(NotificationConsumer.name);

  constructor(
    private readonly kafkaService: KafkaService,
    private readonly jobTracker: JobTrackerService,
    private readonly notificationRepo: NotificationRepository,
    private readonly notificationPublisher: NotificationPublisher,
  ) {}

  async onModuleInit() {
    const consumer = await this.kafkaService.createConsumer(
      KAFKA_GROUP_NOTIFICATION,
    );

    if (!consumer) {
      this.logger.warn('Notification consumer not started because Kafka is unavailable');
      return;
    }

    await consumer.subscribe({
      topic: KAFKA_TOPIC_NOTIFICATION,
      fromBeginning: false,
    });

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
          await this.notificationRepo.create({
            jobKey: payload.jobKey,
            title: payload.title,
            body: payload.body,
            recipientId: payload.recipientId,
            recipientType: payload.recipientType,
          });

          await this.jobTracker.markCompleted(payload.jobKey);
        } catch (error) {
          const retryCount = (payload.retryCount || 0) + 1;
          const reason =
            error instanceof Error ? error.message : 'notification failed';

          if (retryCount < 3) {
            await this.jobTracker.scheduleRetry(
              payload.jobKey,
              reason,
              retryCount,
            );
            return;
          }

          await this.jobTracker.markDeadLettered(payload.jobKey, reason);

          await this.notificationPublisher.publishDeadLetter({
            originalTopic: topic,
            reason,
            payload,
            failedAt: new Date().toISOString(),
          });

          this.logger.error(
            `Notification job failed permanently ${payload.jobKey}`,
            error instanceof Error ? error.stack : String(error),
          );
        }
      },
    });
  }
}
