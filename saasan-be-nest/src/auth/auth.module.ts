import { Global, Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  AuthSessionEntity,
  AuthSessionEntitySchema,
} from './entities/auth-session.entity';
import { AuthSessionRepository } from './repositories/auth-session.repository';

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
  providers: [AuthService, AuthSessionRepository],
  exports: [AuthSessionRepository],
})
export class AuthModule {}
