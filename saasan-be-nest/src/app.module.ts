import { Module } from '@nestjs/common';
import { PollModule } from './poll/poll.module';
import { LocationModule } from './location/location.module';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { LocationSeederModule } from './common/seeders/location/location-seeder.module';
import { UserModule } from './user/user.module';
import { ReportModule } from './report/report.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { EventModule } from './event/event.module';
import { CaseModule } from './case/case.module';
import { CaseSeederModule } from './common/seeders/case/case-seeder.module';
import { PoliticsModule } from './politics/politics.module';
import { PoliticsSeederModule } from './common/seeders/politics/politics-seeder.module';
import { PollSeederModule } from './common/seeders/poll/poll-seeder.module';
import { EventSeederModule } from './common/seeders/event/event-seeder.module';
import { AppController } from './app.controller';
import { ReportSeederModule } from './common/seeders/report/report-seeder.module';
import { CacheModule } from './common/cache/cache.module';
import { MessageModule } from './message/message.module';
import { RolePermissionModule } from './role-permission/role-permission.module';
import { KafkaModule } from './common/kafka/kafka.module';
import { JobsModule } from './common/jobs/jobs.module';
import { NotificationModule } from './common/notification/notification.module';

@Module({
  imports: [
    CacheModule,
    KafkaModule,
    JobsModule,
    NotificationModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.SAASAN_DB_URL!),
    JwtModule.register({
      secret: process.env.SAASAN_JWT_SECRET,
      global: true,
    }),
    // Seeder modules
    LocationSeederModule,
    CaseSeederModule,
    ReportSeederModule,
    PoliticsSeederModule,
    PollSeederModule,
    EventSeederModule,
    // Normal modules
    RolePermissionModule,
    PollModule,
    LocationModule,
    AuthModule,
    UserModule,
    ReportModule,
    DashboardModule,
    EventModule,
    CaseModule,
    PoliticsModule,
    MessageModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
