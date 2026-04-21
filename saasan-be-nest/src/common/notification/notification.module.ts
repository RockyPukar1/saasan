import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  NotificationEntity,
  NotificationSchema,
} from './entities/notification.entity';
import { NotificationRepository } from './repositories/notification.repository';
import { NotificationPublisher } from './publishers/notification.publisher';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: NotificationEntity.name,
        schema: NotificationSchema,
      },
    ]),
  ],
  providers: [NotificationRepository, NotificationPublisher],
  exports: [NotificationRepository, NotificationPublisher],
})
export class NotificationModule {}
