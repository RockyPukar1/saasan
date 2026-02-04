import { Injectable } from '@nestjs/common';

import reportData from './data/report.json';
import { InjectModel } from '@nestjs/mongoose';
import {
  CaseEntity,
  CaseEntityDocument,
} from 'src/case/entities/case.entity';
import { Model } from 'mongoose';

@Injectable()
export class ReportSeeder {
  constructor(
    @InjectModel(CaseEntity.name)
    private readonly caseModel: Model<CaseEntityDocument>,
  ) {}

  async seed() {
    console.log('Seeding report...');

    await this.caseModel.insertMany(reportData);

    console.log('Report seeded successfully');
  }
}
