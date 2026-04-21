import { Module } from '@nestjs/common';
import { EmailService } from './services/email.service';
import { EmailPublisher } from './publishers/email.publisher';
import { KafkaModule } from '../kafka/kafka.module';

@Module({
  imports: [KafkaModule],
  providers: [EmailService, EmailPublisher],
  exports: [EmailService, EmailPublisher],
})
export class EmailModule {}
