import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  PoliticianEntity,
  PoliticianEntitySchema,
} from './politician/entities/politician.entity';
import {
  PoliticianAccountEntity,
  PoliticianAccountEntitySchema,
} from './politician/entities/politician-account.entity';
import { LevelEntity, LevelEntitySchema } from './level/entities/level.entity';
import { PartyEntity, PartyEntitySchema } from './party/entities/party.entity';
import {
  PositionEntity,
  PositionEntitySchema,
} from './position/entities/position.entity';
import { PoliticianController } from './politician/controllers/politician.controller';
import { LevelController } from './level/controllers/level.controller';
import { PartyController } from './party/controllers/party.controller';
import { PositionController } from './position/controllers/position.controller';
import { PoliticianService } from './politician/services/politician.service';
import { PoliticianRepository } from './politician/repositories/politician.repository';
import { LevelService } from './level/services/level.service';
import { LevelRepository } from './level/repositories/level.repository';
import { PartyService } from './party/services/party.service';
import { PositionService } from './position/services/position.service';
import { PartyRepository } from './party/repositories/party.repository';
import { PositionRepository } from './position/repositories/position.repository';
import { AdminPoliticianController } from './politician/controllers/admin-politician.controller';
import { PoliticianAccountRepository } from './politician/repositories/politician-account.repository';
import { EmailModule } from 'src/common/email/email.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PoliticianEntity.name, schema: PoliticianEntitySchema },
      {
        name: PoliticianAccountEntity.name,
        schema: PoliticianAccountEntitySchema,
      },
      { name: LevelEntity.name, schema: LevelEntitySchema },
      { name: PartyEntity.name, schema: PartyEntitySchema },
      { name: PositionEntity.name, schema: PositionEntitySchema },
    ]),
    EmailModule,
  ],
  controllers: [
    PoliticianController,
    AdminPoliticianController,
    LevelController,
    PartyController,
    PositionController,
  ],
  providers: [
    // services
    PoliticianService,
    PartyService,
    LevelService,
    PositionService,

    // repositories
    PoliticianRepository,
    PoliticianAccountRepository,
    LevelRepository,
    PartyRepository,
    PositionRepository,
  ],
  exports: [
    PoliticianRepository,
    LevelRepository,
    PartyRepository,
    PositionRepository,
  ],
})
export class PoliticsModule {}
