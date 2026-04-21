import { Module } from '@nestjs/common';
import { NotificationModule } from './notification.module';
import { NotificationConsumer } from './consumers/notification.consumer';

@Module({
  imports: [NotificationModule],
  providers: [NotificationConsumer],
})
export class NotificationWorkerModule {}
