import { Injectable } from '@nestjs/common';

import reportData from './data/case.json';
import { InjectModel } from '@nestjs/mongoose';
import {
  CaseEntity,
  CaseEntityDocument,
} from 'src/case/entities/case.entity';
import { Model } from 'mongoose';

@Injectable()
export class CaseSeeder {
  constructor(
    @InjectModel(CaseEntity.name)
    private readonly caseModel: Model<CaseEntityDocument>,
  ) {}

  async seed() {
    console.log('Seeding case...');

    await this.caseModel.insertMany(reportData);

    console.log('Case seeded successfully');
  }
}
