import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  PoliticianEntity,
  PoliticianEntitySchema,
} from 'src/politics/entities/politician.entity';
import { PoliticianSeeder } from './politician.seeder';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PoliticianEntity.name, schema: PoliticianEntitySchema },
    ]),
  ],
  providers: [PoliticianSeeder],
  exports: [PoliticianSeeder],
})
export class PoliticianSeederModule {}
