import { Module } from '@nestjs/common';
import { EmailModule } from './email.module';
import { EmailConsumer } from './consumers/email.consumer';

@Module({
  imports: [EmailModule],
  providers: [EmailConsumer],
})
export class EmailWorkerModule {}
