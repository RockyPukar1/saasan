import { Injectable } from '@nestjs/common';
import { JobTrackerService } from 'src/common/jobs/services/job-tracker.service';
import { KafkaService } from 'src/common/kafka/services/kafka.service';
import { NotificationEventPayload } from '../events/notification.events';
import {
  KAFKA_TOPIC_NOTIFICATION,
  KAFKA_TOPIC_NOTIFICATION_DLT,
} from 'src/common/kafka/constants/kafka.constants';

@Injectable()
export class NotificationPublisher {
  constructor(
    private readonly kafkaService: KafkaService,
    private readonly jobTracker: JobTrackerService,
  ) {}

  async publish(payload: NotificationEventPayload) {
    await this.jobTracker.registerPending({
      jobKey: payload.jobKey,
      topic: KAFKA_TOPIC_NOTIFICATION,
      jobType: payload.type,
      payload,
      maxAttempts: 3,
    });

    try {
      await this.kafkaService.emit(KAFKA_TOPIC_NOTIFICATION, payload);
    } catch (error) {
      const reason =
        error instanceof Error ? error.message : 'notification publish failed';
      await this.jobTracker.markDeadLettered(payload.jobKey, reason);
      throw error;
    }
  }

  async publishDeadLetter(payload: Record<string, unknown>) {
    await this.kafkaService.emit(KAFKA_TOPIC_NOTIFICATION_DLT, payload);
  }
}
