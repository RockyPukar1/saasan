import { Module } from '@nestjs/common';
import { FileConsumer } from './consumers/file.consumer';
import { FileModule } from './file.module';

@Module({
  imports: [FileModule],
  providers: [FileConsumer],
})
export class FileWorkerModule {}
