import { Injectable } from '@nestjs/common';

import partyData from './data/party.json';
import politicianData from './data/politician.json';
import postData from './data/post.json';

import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
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
    const positionMap = new Map<string, Types.ObjectId>();
    const partyMap = new Map<string, Types.ObjectId>();

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
        const positionDoc = await this.positionModel.findOneAndUpdate(
          { title: position.title },
          {
            $set: {
              title: position.title,
              description: position.description,
              abbreviation: position.abbreviation,
              levelId,
            },
          },
          { upsert: true, new: true },
        );

        positionMap.set(position.title, positionDoc._id);
      }
    }
    console.log('Position seeded successfully');

    console.log('Seeding party...');
    for (const party of partyData) {
      const partyDoc = await this.partyModel.findOneAndUpdate(
        { name: party.name },
        {
          $set: {
            name: party.name,
            abbreviation: party.abbreviation,
            ideology: party.ideology,
            foundedIn: party.foundedIn,
            logoUrl: party.logoUrl,
            color: party.color,
          },
        },
        { upsert: true, new: true },
      );
      partyMap.set(party.name, partyDoc._id);
    }
    console.log('Party seeded successfully');

    console.log('Seeding politician...');
    for (const politician of politicianData) {
      const partyId = politician.party ? partyMap.get(politician.party) : false;
      const isIndependent = !partyId;

      const positionIds =
        politician.positions
          ?.map((pos) => positionMap.get(pos))
          .filter(Boolean) || [];
      await this.politicianModel.findOneAndUpdate(
        { fullName: politician.fullName },
        {
          $setOnInsert: {
            fullName: politician.fullName,
          },
          ...(isIndependent
            ? { $set: { isIndependent: true } }
            : { $set: { partyId } }),
          ...(positionIds.length && {
            $addToSet: { positionIds: { $each: positionIds } },
          }),
        },
        { upsert: true, new: true },
      );
    }
    console.log('Politician seeded successfully');
  }
}
