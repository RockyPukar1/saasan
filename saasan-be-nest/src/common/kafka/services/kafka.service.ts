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
  private producerConnected = false;

  async onModuleInit() {
    try {
      await this.ensureProducerConnected();
    } catch (error) {
      this.logger.warn(
        `Kafka producer unavailable during startup; continuing without Kafka. ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }
  }

  async emit(topic: string, payload: Record<string, any>) {
    const isConnected = await this.ensureProducerConnected();

    if (!isConnected) {
      throw new Error(
        `Kafka producer is unavailable; failed to publish topic "${topic}"`,
      );
    }

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

    try {
      await consumer.connect();
      this.consumers.push(consumer);
      return consumer;
    } catch (error) {
      this.logger.warn(
        `Kafka consumer "${groupId}" unavailable; background consumer will stay idle. ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
      return null;
    }
  }

  async onModuleDestroy() {
    for (const consumer of this.consumers) {
      await consumer.disconnect();
    }

    if (this.producerConnected) {
      await this.producer.disconnect();
    }

    this.logger.log('Kafka connections closed');
  }

  private async ensureProducerConnected() {
    if (this.producerConnected) {
      return true;
    }

    try {
      await this.producer.connect();
      this.producerConnected = true;
      this.logger.log('Kafka producer connected');
      return true;
    } catch (error) {
      this.producerConnected = false;
      return false;
    }
  }
}
