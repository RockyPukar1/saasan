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
import { ViralModule } from './viral/viral.module';
import { ServiceModule } from './service/service.module';
import { VoterRegistrationModule } from './vote/voter-registration/voter-registration.module';
import { VoterIntentSurveyModule } from './vote/voter-intent-survey/voter-intent-survey.module';
import { VotingSessionModule } from './vote/voting-session/voting-session.module';
import { VotingCenterModule } from './vote/voting-center/voting-center.module';
import { UserVoteModule } from './vote/user-vote/user-vote.module';
import { ReportSeederModule } from './common/seeders/report/report-seeder.module';
import { PoliticsModule } from './politics/politics.module';
import { PoliticsSeederModule } from './common/seeders/politics/politics-seeder.module';
import { PollSeederModule } from './common/seeders/poll/poll-seeder.module';
import { EventSeederModule } from './common/seeders/event/event-seeder.module';
import { AppController } from './app.controller';

@Module({
  imports: [
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
    ReportSeederModule,
    PoliticsSeederModule,
    PollSeederModule,
    EventSeederModule,
    // Normal modules
    PollModule,
    LocationModule,
    AuthModule,
    UserModule,
    ReportModule,
    DashboardModule,
    EventModule,
    CaseModule,
    ViralModule,
    ServiceModule,
    PoliticsModule,
    VoterRegistrationModule,
    VoterIntentSurveyModule,
    VotingSessionModule,
    VotingCenterModule,
    UserVoteModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
