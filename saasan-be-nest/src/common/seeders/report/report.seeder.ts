import { Injectable } from '@nestjs/common';

import reportData from './data/report.json';
import { InjectModel } from '@nestjs/mongoose';
import {
  ReportEntity,
  ReportEntityDocument,
} from 'src/report/entities/report.entity';
import { Model } from 'mongoose';

@Injectable()
export class ReportSeeder {
  constructor(
    @InjectModel(ReportEntity.name)
    private readonly reportModel: Model<ReportEntityDocument>,
  ) {}

  async seed() {
    console.log('Seeding report...');

    await this.reportModel.insertMany(reportData);

    console.log('Report seeded successfully');
  }
}
