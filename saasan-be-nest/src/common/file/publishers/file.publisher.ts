import { Injectable } from '@nestjs/common';
import { KafkaService } from 'src/common/kafka/services/kafka.service';
import {
  EvidenceUploadedFileEvent,
  FailedFileEvent,
} from '../events/file.events';
import {
  KAFKA_TOPIC_FILE,
  KAFKA_TOPIC_FILE_DLT,
} from 'src/common/kafka/constants/kafka.constants';
import { JobTrackerService } from 'src/common/jobs/services/job-tracker.service';

@Injectable()
export class FilePublisher {
  constructor(
    private readonly kafkaService: KafkaService,
    private readonly jobTracker: JobTrackerService,
  ) {}

  async publishEvidenceUploaded(payload: EvidenceUploadedFileEvent) {
    await this.jobTracker.registerPending({
      jobKey: payload.jobKey,
      topic: KAFKA_TOPIC_FILE,
      jobType: payload.type,
      payload,
      maxAttempts: 3,
    });

    await this.kafkaService.emit(KAFKA_TOPIC_FILE, payload);
  }

  async publishDeadLetter(payload: FailedFileEvent) {
    await this.kafkaService.emit(KAFKA_TOPIC_FILE_DLT, payload);
  }
}
