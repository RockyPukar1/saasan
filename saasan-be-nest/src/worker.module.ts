import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { KafkaModule } from './common/kafka/kafka.module';
import { JobsModule } from './common/jobs/jobs.module';
import { NotificationModule } from './common/notification/notification.module';
import { EmailWorkerModule } from './common/email/email.worker.module';
import { FileWorkerModule } from './common/file/file.worker.module';
import { NotificationWorkerModule } from './common/notification/notification.worker.module';
import { AuthModule } from './auth/auth.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { CacheModule } from './common/cache/cache.module';
import { RolePermissionModule } from './role-permission/role-permission.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.register({
      secret: process.env.SAASAN_JWT_SECRET,
      global: true,
    }),
    MongooseModule.forRoot(process.env.SAASAN_DB_URL!),
    CacheModule,
    RolePermissionModule,
    ScheduleModule.forRoot(),
    KafkaModule,
    JobsModule,
    NotificationModule,
    EmailWorkerModule,
    FileWorkerModule,
    NotificationWorkerModule,
    AuthModule,
    DashboardModule,
  ],
})
export class WorkerModule {}
