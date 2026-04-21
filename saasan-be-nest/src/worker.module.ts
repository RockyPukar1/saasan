import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { KafkaModule } from './common/kafka/kafka.module';
import { JobsModule } from './common/jobs/jobs.module';
import { NotificationModule } from './common/notification/notification.module';
import { EmailWorkerModule } from './common/email/email.worker.module';
import { FileModule } from './common/file/file.module';
import { NotificationWorkerModule } from './common/notification/notification.worker.module';
import { AuthModule } from './auth/auth.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.SAASAN_DB_URL!),
    ScheduleModule.forRoot(),
    KafkaModule,
    JobsModule,
    NotificationModule,
    EmailWorkerModule,
    FileModule,
    NotificationWorkerModule,
    AuthModule,
    DashboardModule,
  ],
})
export class WorkerModule {}
