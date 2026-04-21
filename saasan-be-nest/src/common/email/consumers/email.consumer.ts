import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { KafkaService } from 'src/common/kafka/services/kafka.service';
import { EmailService } from '../services/email.service';
import {
  KAFKA_GROUP_EMAIL,
  KAFKA_TOPIC_EMAIL,
} from 'src/common/kafka/constants/kafka.constants';
import { EMAIL_EVENT_TYPES } from '../events/email.events';
import { EmailTemplateFactory } from '../templates/template.factory';
import { EmailPublisher } from '../publishers/email.publisher';
import { JobTrackerService } from 'src/common/jobs/services/job-tracker.service';

@Injectable()
export class EmailConsumer implements OnModuleInit {
  private readonly logger = new Logger(EmailConsumer.name);
  private readonly maxRetries = 3;

  constructor(
    private readonly kafkaService: KafkaService,
    private readonly emailService: EmailService,
    private readonly emailPublisher: EmailPublisher,
    private readonly jobTracker: JobTrackerService,
  ) {}

  async onModuleInit() {
    const consumer = await this.kafkaService.createConsumer(KAFKA_GROUP_EMAIL);

    await consumer.subscribe({
      topic: KAFKA_TOPIC_EMAIL,
      fromBeginning: false,
    });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        if (!message.value) return;
        const payload = JSON.parse(message.value.toString());

        const canProcess = await this.jobTracker.beginProcessing(
          payload.jobKey,
        );

        if (!canProcess) {
          return;
        }

        try {
          if (payload.type === EMAIL_EVENT_TYPES.POLITICIAN_ACCOUNT_CREATED) {
            const emailTemplate =
              EmailTemplateFactory.createPoliticianAccountEmail({
                politicianName: payload.politicianName,
                email: payload.to,
                password: payload.password,
              });

            await this.emailService.sendEmail({
              to: payload.to,
              subject: emailTemplate.subject,
              html: emailTemplate.html,
            });

            await this.jobTracker.markCompleted(payload.jobKey);

            this.logger.log(
              `Processed ${payload.type} for ${payload.to} topic=${topic} partition=${partition}`,
            );
          }
        } catch (error) {
          const retryCount = (payload.retryCount || 0) + 1;
          const reason =
            error instanceof Error ? error.message : 'unknown email error';

          this.logger.error(
            `Failed processing email event topic=${topic} partition=${partition} retryCount=${retryCount} reason=${reason}`,
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

          await this.emailPublisher.publishDeadLetter({
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
