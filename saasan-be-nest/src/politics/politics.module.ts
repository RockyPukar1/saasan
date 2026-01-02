import { Module } from '@nestjs/common';
import { PoliticianController } from './controllers/politician.controller';
import { PoliticianService } from './services/politician.service';
import { PoliticianRepository } from './repositories/politician.repository';
import { MongooseModule } from '@nestjs/mongoose';
import {
  PoliticianEntity,
  PoliticianEntitySchema,
} from './entities/politician.entity';
import { LevelEntity, LevelEntitySchema } from './entities/level.entity';
import { LevelController } from './controllers/level.controller';
import { LevelService } from './services/level.service';
import { LevelRepository } from './repositories/level.repository';
import { PartyRepository } from './repositories/party.repository';
import { PartyService } from './services/party.service';
import { PartyEntity, PartyEntitySchema } from './entities/party.entity';
import { PartyController } from './controllers/party.controller';
import { PositionService } from './services/position.service';
import { PositionRepository } from './repositories/position.repository';
import {
  PositionEntity,
  PositionEntitySchema,
} from './entities/position.entity';
import { PositionController } from './controllers/position.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PoliticianEntity.name, schema: PoliticianEntitySchema },
      { name: LevelEntity.name, schema: LevelEntitySchema },
      { name: PartyEntity.name, schema: PartyEntitySchema },
      { name: PositionEntity.name, schema: PositionEntitySchema },
    ]),
  ],
  controllers: [
    PoliticianController,
    LevelController,
    PartyController,
    PositionController,
  ],
  providers: [
    PoliticianService,
    PoliticianRepository,
    LevelService,
    LevelRepository,
    PartyService,
    PartyRepository,
    PositionService,
    PositionRepository,
  ],
  exports: [PoliticianRepository],
})
export class PoliticsModule {}
