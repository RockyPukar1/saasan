import { Global, Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AdminAuthController } from './controllers/admin-auth.controller';
import { CitizenAuthController } from './controllers/citizen-auth.controller';
import { PoliticianAuthController } from './controllers/politician-auth.controller';
import { AuthService } from './services/auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  AuthSessionEntity,
  AuthSessionEntitySchema,
} from './entities/auth-session.entity';
import { AuthSessionRepository } from './repositories/auth-session.repository';
import { AuthSessionCleanupService } from './services/auth-session-cleanup.service';
import { PoliticsModule } from 'src/politics/politics.module';
import { UserModule } from 'src/user/user.module';

@Global()
@Module({
  imports: [
    UserModule,
    PoliticsModule,
    MongooseModule.forFeature([
      {
        name: AuthSessionEntity.name,
        schema: AuthSessionEntitySchema,
      },
    ]),
  ],
  controllers: [
    AuthController,
    AdminAuthController,
    CitizenAuthController,
    PoliticianAuthController,
  ],
  providers: [AuthService, AuthSessionRepository, AuthSessionCleanupService],
  exports: [AuthSessionRepository],
})
export class AuthModule {}
