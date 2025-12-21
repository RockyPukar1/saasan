import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';
import {
  PollVoteEntity,
  PollVoteEntityDocument,
} from '../entities/poll-vote.entity';

@Injectable()
export class PollVoteRepository {
  constructor(
    @InjectModel(PollVoteEntity.name)
    private readonly model: Model<PollVoteEntityDocument>,
  ) {}

  async incrTotalVotes(pollId: string, session: ClientSession) {
    return await this.model.findByIdAndUpdate(
      pollId,
      {
        $inc: {
          totalVotes: 1,
        },
      },
      { session },
    );
  }

  async getTotalVotes(pollId: string) {
    return await this.model.countDocuments({ pollId });
  }
}
