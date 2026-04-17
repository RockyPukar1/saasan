import { Global, Module } from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import { UserEntity, UserEntitySchema } from './entities/user.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './services/user.services';
import { CitizenUserController } from './controllers/citizen-user.controller';
import { AdminUserController } from './controllers/admin-user.controller';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserEntity.name, schema: UserEntitySchema },
    ]),
  ],
  controllers: [CitizenUserController, AdminUserController],
  providers: [UserRepository, UserService],
  exports: [UserRepository],
})
export class UserModule {}
