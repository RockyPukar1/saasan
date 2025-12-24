import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PollSeeder } from './poll.seeder';
import { PollEntity, PollEntitySchema } from 'src/poll/entities/poll.entity';
import {
  PollOptionEntity,
  PollOptionEntitySchema,
} from 'src/poll/entities/poll-option.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PollEntity.name, schema: PollEntitySchema },
      { name: PollOptionEntity.name, schema: PollOptionEntitySchema },
    ]),
  ],
  providers: [PollSeeder],
  exports: [PollSeeder],
})
export class PollSeederModule {}
