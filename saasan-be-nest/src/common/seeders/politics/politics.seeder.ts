import { Injectable } from '@nestjs/common';

import partyData from './data/party.json';
import politicianData from './data/politician.json';
import postData from './data/post.json';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  PoliticianEntity,
  PoliticianEntityDocument,
} from 'src/politics/entities/politician.entity';
import {
  LevelEntity,
  LevelEntityDocument,
} from 'src/politics/entities/level.entity';
import {
  PositionEntity,
  PositionEntityDocument,
} from 'src/politics/entities/position.entity';
import {
  PartyEntity,
  PartyEntityDocument,
} from 'src/politics/entities/party.entity';

@Injectable()
export class PoliticsSeeder {
  constructor(
    @InjectModel(LevelEntity.name)
    private readonly levelModel: Model<LevelEntityDocument>,
    @InjectModel(PositionEntity.name)
    private readonly positionModel: Model<PositionEntityDocument>,
    @InjectModel(PartyEntity.name)
    private readonly partyModel: Model<PartyEntityDocument>,
    @InjectModel(PoliticianEntity.name)
    private readonly politicianModel: Model<PoliticianEntityDocument>,
  ) {}

  async seed() {
    console.log('Seeding levels and positions');
    for (const level of postData) {
      const levelDoc = await this.levelModel.findOneAndUpdate(
        { name: level.name },
        {
          $set: {
            name: level.name,
            description: level.description,
          },
        },
        { upsert: true, new: true },
      );

      if (!level?.positions?.length) continue;

      const levelId = levelDoc._id;
      const positions = level.positions;

      for (const position of positions) {
        await this.positionModel.findOneAndUpdate(
          { title: position.title },
          {
            $set: {
              title: position.title,
              description: position.description,
              levelId,
            },
          },
          { upsert: true, new: true },
        );
      }
    }
    console.log('Position seeded successfully');

    console.log('Seeding party...');
    await this.partyModel.insertMany(partyData);
    console.log('Party seeded successfully');

    console.log('Seeding politician...');
    await this.politicianModel.insertMany(politicianData);
    console.log('Politician seeded successfully');
  }
}
