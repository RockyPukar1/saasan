import { Global, Module } from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import { UserEntity, UserEntitySchema } from './entities/user.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './services/user.services';
import { CitizenUserController } from './controllers/citizen-user.controller';
import { AdminUserController } from './controllers/admin-user.controller';
import { PoliticianUserController } from './controllers/politician-user.controller';
import { CitizenEntity, CitizenEntitySchema } from './entities/citizen.entity';
import { AdminEntity, AdminEntitySchema } from './entities/admin.entity';
import { CitizenRepository } from './repositories/citizen.repository';
import { AdminRepository } from './repositories/admin.repository';
import {
  PoliticianEntity,
  PoliticianEntitySchema,
} from 'src/politics/politician/entities/politician.entity';
@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserEntity.name, schema: UserEntitySchema },
      { name: CitizenEntity.name, schema: CitizenEntitySchema },
      { name: AdminEntity.name, schema: AdminEntitySchema },
      { name: PoliticianEntity.name, schema: PoliticianEntitySchema },
    ]),
  ],
  controllers: [
    CitizenUserController,
    AdminUserController,
    PoliticianUserController,
  ],
  providers: [UserRepository, CitizenRepository, AdminRepository, UserService],
  exports: [UserRepository, CitizenRepository, AdminRepository],
})
export class UserModule {}
