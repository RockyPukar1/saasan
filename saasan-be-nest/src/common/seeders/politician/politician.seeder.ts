import { Injectable } from '@nestjs/common';

import politicianData from './data/politician.json';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  PoliticianEntity,
  PoliticianEntityDocument,
} from 'src/politics/entities/politician.entity';

@Injectable()
export class PoliticianSeeder {
  constructor(
    @InjectModel(PoliticianEntity.name)
    private readonly politicianModel: Model<PoliticianEntityDocument>,
  ) {}

  async seed() {
    console.log('Seeding politician...');

    await this.politicianModel.insertMany(politicianData);

    console.log('Politician seeded successfully');
  }
}
