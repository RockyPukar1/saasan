import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  PoliticianEntity,
  PoliticianEntitySchema,
} from 'src/politics/politician/entities/politician.entity';
import { PoliticsSeeder } from './politics.seeder';
import {
  PartyEntity,
  PartyEntitySchema,
} from 'src/politics/party/entities/party.entity';
import {
  LevelEntity,
  LevelEntitySchema,
} from 'src/politics/level/entities/level.entity';
import {
  PositionEntity,
  PositionEntitySchema,
} from 'src/politics/position/entities/position.entity';
import {
  PoliticianPromiseEntity,
  PoliticianPromiseEntitySchema,
} from 'src/politics/politician/entities/politician-promise.entity';
import {
  PoliticianAchievementEntity,
  PoliticianAchievementSchema,
} from 'src/politics/politician/entities/politician-achievement.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PoliticianEntity.name, schema: PoliticianEntitySchema },
      { name: PartyEntity.name, schema: PartyEntitySchema },
      { name: LevelEntity.name, schema: LevelEntitySchema },
      { name: PositionEntity.name, schema: PositionEntitySchema },
      {
        name: PoliticianPromiseEntity.name,
        schema: PoliticianPromiseEntitySchema,
      },
      {
        name: PoliticianAchievementEntity.name,
        schema: PoliticianAchievementSchema,
      },
    ]),
  ],
  providers: [PoliticsSeeder],
  exports: [PoliticsSeeder],
})
export class PoliticsSeederModule {}
