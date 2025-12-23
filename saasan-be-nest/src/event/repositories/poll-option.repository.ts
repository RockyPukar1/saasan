import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';
import {
  PollOptionEntity,
  PollOptionEntityDocument,
} from '../entities/poll-option.entity';
import { CreatePollOptionsDto } from '../dtos/create-poll-option.dto';
import { VoteDto } from '../dtos/vote.dto';

@Injectable()
export class PollOptionRepository {
  constructor(
    @InjectModel(PollOptionEntity.name)
    private readonly model: Model<PollOptionEntityDocument>,
  ) {}

  async create(pollOptionData: CreatePollOptionsDto) {
    return await this.model.create(pollOptionData);
  }

  async incrVoteCount({ pollId, optionId }: VoteDto, session: ClientSession) {
    return await this.model.findByIdAndUpdate(
      optionId,
      {
        $inc: {
          voteCount: 1,
        },
      },
      { session },
    );
  }
}
