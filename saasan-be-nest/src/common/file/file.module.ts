import { Module } from '@nestjs/common';
import { KafkaModule } from '../kafka/kafka.module';
import { FilePublisher } from './publishers/file.publisher';
import { FileConsumer } from './consumers/file.consumer';

@Module({
  imports: [KafkaModule],
  providers: [FilePublisher, FileConsumer],
  exports: [FilePublisher],
})
export class FileModule {}
