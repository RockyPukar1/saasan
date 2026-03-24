import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { UserModule } from 'src/user/user.module';
import { CacheModule } from 'src/common/cache/cache.module';

@Module({
  imports: [UserModule, CacheModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
