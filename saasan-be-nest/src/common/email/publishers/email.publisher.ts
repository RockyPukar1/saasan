import { Injectable } from '@nestjs/common';
import {
  KAFKA_TOPIC_EMAIL,
  KAFKA_TOPIC_EMAIL_DLT,
} from 'src/common/kafka/constants/kafka.constants';
import { KafkaService } from 'src/common/kafka/services/kafka.service';
import {
  FailedEmailEvent,
  PoliticianAccountCreatedEmailEvent,
} from '../events/email.events';
import { JobTrackerService } from 'src/common/jobs/services/job-tracker.service';

@Injectable()
export class EmailPublisher {
  constructor(
    private readonly kafkaService: KafkaService,
    private readonly jobTracker: JobTrackerService,
  ) {}

  async publishPoliticianAccountCreated(
    payload: PoliticianAccountCreatedEmailEvent,
  ) {
    await this.jobTracker.registerPending({
      jobKey: payload.jobKey,
      topic: KAFKA_TOPIC_EMAIL,
      jobType: payload.type,
      payload,
      maxAttempts: 3,
    });

    try {
      await this.kafkaService.emit(KAFKA_TOPIC_EMAIL, payload);
    } catch (error) {
      const reason =
        error instanceof Error ? error.message : 'email publish failed';
      await this.jobTracker.markDeadLettered(payload.jobKey, reason);
      throw error;
    }
  }

  async publishDeadLetter(payload: FailedEmailEvent) {
    await this.kafkaService.emit(KAFKA_TOPIC_EMAIL_DLT, payload);
  }
}
