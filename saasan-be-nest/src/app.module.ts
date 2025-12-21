import { Module } from '@nestjs/common';
import { PollModule } from './poll/poll.module';
import { LocationModule } from './location/location.module';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { LocationSeederModule } from './common/seeders/location/location-seeder.module';
import { UserModule } from './user/user.module';

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
  ],
})
export class AppModule {}
