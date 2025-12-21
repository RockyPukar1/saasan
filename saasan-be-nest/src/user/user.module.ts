import { Module } from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import { UserEntity, UserEntitySchema } from './entities/user.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './services/user.services';
import { UserController } from './controllers/user.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserEntity.name, schema: UserEntitySchema },
    ]),
  ],
  controllers: [UserController],
  providers: [UserRepository, UserService],
  exports: [UserRepository],
})
export class UserModule {}
