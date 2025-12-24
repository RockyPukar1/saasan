import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  PartyEntity,
  PartyEntitySchema,
} from 'src/politics/entities/party.entity';
import { PartySeeder } from './party.seeder';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PartyEntity.name, schema: PartyEntitySchema },
    ]),
  ],
  providers: [PartySeeder],
  exports: [PartySeeder],
})
export class PartySeederModule {}
