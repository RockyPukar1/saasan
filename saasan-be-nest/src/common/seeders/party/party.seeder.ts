import { Injectable } from '@nestjs/common';

import partyData from './data/party.json';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  PartyEntity,
  PartyEntityDocument,
} from 'src/politics/entities/party.entity';

@Injectable()
export class PartySeeder {
  constructor(
    @InjectModel(PartyEntity.name)
    private readonly partyModel: Model<PartyEntityDocument>,
  ) {}

  async seed() {
    console.log('Seeding politician...');

    await this.partyModel.insertMany(partyData);

    console.log('Party seeded successfully');
  }
}
