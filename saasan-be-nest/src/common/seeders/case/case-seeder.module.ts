import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CaseEntity,
  CaseEntitySchema,
} from 'src/case/entities/case.entity';
import { CaseSeeder } from './case.seeder';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CaseEntity.name, schema: CaseEntitySchema },
    ]),
  ],
  providers: [ CaseSeeder],
  exports: [CaseSeeder],
})
export class CaseSeederModule {}
