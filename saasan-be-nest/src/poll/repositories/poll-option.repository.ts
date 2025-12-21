import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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

  async incrVoteCount({ pollId, optionId }: VoteDto) {
    return await this.model.findOneAndUpdate(
      { pollId, optionId },
      {
        $inc: {
          voteCount: 1,
        },
      },
    );
  }

  async getOptionStats(pollId: string) {
    return await this.model.findById(pollId, { text: 1, voteCount: 1, _id: 0 });
  }
}
