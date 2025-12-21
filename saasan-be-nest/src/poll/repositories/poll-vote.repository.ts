import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';
import {
  PollVoteEntity,
  PollVoteEntityDocument,
} from '../entities/poll-vote.entity';
import { VoteDto } from '../dtos/vote.dto';

@Injectable()
export class PollVoteRepository {
  constructor(
    @InjectModel(PollVoteEntity.name)
    private readonly model: Model<PollVoteEntityDocument>,
  ) {}

  async create(voteData: VoteDto) {
    await this.model.create(voteData);
  }

  async getTotalVotes(pollId: string) {
    return await this.model.countDocuments({ pollId });
  }
}
