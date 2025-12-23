import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ReportEntity,
  ReportEntitySchema,
} from 'src/report/entities/report.entity';
import { ReportSeeder } from './report.seeder';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ReportEntity.name, schema: ReportEntitySchema },
    ]),
  ],
  providers: [ReportSeeder],
  exports: [ReportSeeder],
})
export class ReportSeederModule {}
