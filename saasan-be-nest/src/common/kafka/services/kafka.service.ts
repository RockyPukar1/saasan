import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { Consumer, Kafka, Producer } from 'kafkajs';

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(KafkaService.name);
  private readonly kafka = new Kafka({
    clientId: process.env.SAASAN_KAFKA_CLIENT_ID,
    brokers: (process.env.SAASAN_KAFKA_BROKERS || 'localhost:9092')
      .split(',')
      .map((broker) => broker.trim())
      .filter(Boolean),
  });

  private producer: Producer = this.kafka.producer();
  private consumers: Consumer[] = [];

  async onModuleInit() {
    await this.producer.connect();
    this.logger.log('Kafka producer connected');
  }

  async emit(topic: string, payload: Record<string, any>) {
    await this.producer.send({
      topic,
      messages: [
        {
          value: JSON.stringify(payload),
        },
      ],
    });
  }

  async createConsumer(groupId: string) {
    const consumer = this.kafka.consumer({ groupId });
    await consumer.connect();
    this.consumers.push(consumer);
    return consumer;
  }

  async onModuleDestroy() {
    for (const consumer of this.consumers) {
      await consumer.disconnect();
    }

    await this.producer.disconnect();
    this.logger.log('Kafka connections closed');
  }
}
