import { Module } from '@nestjs/common';
import { KafkaModule } from '../kafka/kafka.module';
import { FilePublisher } from './publishers/file.publisher';

@Module({
  imports: [KafkaModule],
  providers: [FilePublisher],
  exports: [FilePublisher],
})
export class FileModule {}
