import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  PoliticianEntity,
  PoliticianEntitySchema,
} from '@/politics/politician/entities/politician.entity';
import { PoliticsSeeder } from './politics.seeder';
import {
  PartyEntity,
  PartyEntitySchema,
} from '@/politics/party/entities/party.entity';
import {
  LevelEntity,
  LevelEntitySchema,
} from '@/politics/level/entities/level.entity';
import {
  PositionEntity,
  PositionEntitySchema,
} from '@/politics/position/entities/position.entity';
import {
  PoliticianPromiseEntity,
  PoliticianPromiseEntitySchema,
} from '@/politics/politician/entities/politician-promise.entity';
import {
  PoliticianAchievementEntity,
  PoliticianAchievementSchema,
} from '@/politics/politician/entities/politician-achievement.entity';

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
