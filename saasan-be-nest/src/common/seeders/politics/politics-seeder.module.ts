import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  PoliticianEntity,
  PoliticianEntitySchema,
} from 'src/politics/entities/politician.entity';
import { PoliticsSeeder } from './politics.seeder';
import {
  PartyEntity,
  PartyEntitySchema,
} from 'src/politics/entities/party.entity';
import {
  LevelEntity,
  LevelEntitySchema,
} from 'src/politics/entities/level.entity';
import {
  PositionEntity,
  PositionEntitySchema,
} from 'src/politics/entities/position.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PoliticianEntity.name, schema: PoliticianEntitySchema },
      { name: PartyEntity.name, schema: PartyEntitySchema },
      { name: LevelEntity.name, schema: LevelEntitySchema },
      { name: PositionEntity.name, schema: PositionEntitySchema },
    ]),
  ],
  providers: [PoliticsSeeder],
  exports: [PoliticsSeeder],
})
export class PoliticsSeederModule {}
