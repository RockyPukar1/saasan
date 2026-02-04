import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CaseEntity,
  CaseEntitySchema,
} from 'src/case/entities/case.entity';
import { ReportSeeder } from './report.seeder';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CaseEntity.name, schema: CaseEntitySchema },
    ]),
  ],
  providers: [ ReportSeeder],
  exports: [ReportSeeder],
})
export class ReportSeederModule {}
