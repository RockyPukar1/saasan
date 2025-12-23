import { Module } from '@nestjs/common';
import { PollModule } from './poll/poll.module';
import { LocationModule } from './location/location.module';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { LocationSeederModule } from './common/seeders/location/location-seeder.module';
import { UserModule } from './user/user.module';
import { PoliticianModule } from './politician/politician.module';
import { PartyModule } from './party/party.module';
import { ReportModule } from './report/report.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { EventModule } from './event/event.module';
import { CaseModule } from './case/case.module';
import { ViralModule } from './viral/viral.module';
import { ContentModule } from './content/content.module';
import { ServiceModule } from './service/service.module';
import { LevelModule } from './level/level.module';
import { PositionModule } from './position/position.module';

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
    PollModule,
    LocationModule,
    LocationSeederModule,
    AuthModule,
    UserModule,
    PoliticianModule,
    PartyModule,
    ReportModule,
    DashboardModule,
    EventModule,
    CaseModule,
    ViralModule,
    ContentModule,
    ServiceModule,
    LevelModule,
    PositionModule,
  ],
  providers: [],
})
export class AppModule {}
