import { Module } from '@nestjs/common';
import { EmailService } from './services/email.service';
import { EmailPublisher } from './publishers/email.publisher';
import { EmailConsumer } from './consumers/email.consumer';
import { KafkaModule } from '../kafka/kafka.module';

@Module({
  imports: [KafkaModule],
  providers: [EmailService, EmailPublisher, EmailConsumer],
  exports: [EmailService, EmailPublisher],
})
export class EmailModule {}
