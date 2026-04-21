import { Global, Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  AuthSessionEntity,
  AuthSessionEntitySchema,
} from './entities/auth-session.entity';
import { AuthSessionRepository } from './repositories/auth-session.repository';
import { AuthSessionCleanupService } from './services/auth-session-cleanup.service';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: AuthSessionEntity.name,
        schema: AuthSessionEntitySchema,
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthSessionRepository, AuthSessionCleanupService],
  exports: [AuthSessionRepository],
})
export class AuthModule {}
