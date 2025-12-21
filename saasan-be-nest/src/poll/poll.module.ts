import { Module } from '@nestjs/common';
import { PollController } from './controllers/poll.controller';
import { PollService } from './services/poll.service';
import { PollRepository } from './repositories/poll.repository';
import { PollVoteRepository } from './repositories/poll-vote.repository';
import { PollOptionRepository } from './repositories/poll-option.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { PollEntity, PollEntitySchema } from './entities/poll.entity';
import {
  PollVoteEntity,
  PollVoteEntitySchema,
} from './entities/poll-vote.entity';
import {
  PollOptionEntity,
  PollOptionEntitySchema,
} from './entities/poll-option.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PollEntity.name, schema: PollEntitySchema },
      { name: PollVoteEntity.name, schema: PollVoteEntitySchema },
      { name: PollOptionEntity.name, schema: PollOptionEntitySchema },
    ]),
  ],
  controllers: [PollController],
  providers: [
    PollService,
    PollRepository,
    PollVoteRepository,
    PollOptionRepository,
  ],
})
export class PollModule {}
