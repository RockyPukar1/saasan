import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model, Types } from 'mongoose';
import {
  PollVoteEntity,
  PollVoteEntityDocument,
} from '../entities/poll-vote.entity';
import { VoteDto } from '../dtos/vote.dto';
import { PollIdDto } from 'src/viral/dtos/poll-id.dto';

@Injectable()
export class PollVoteRepository {
  constructor(
    @InjectModel(PollVoteEntity.name)
    private readonly model: Model<PollVoteEntityDocument>,
  ) {}

  async create(userId: string, { pollId, optionId }: VoteDto) {
    await this.model.create({
      pollId: new Types.ObjectId(pollId),
      optionId: new Types.ObjectId(optionId),
      userId: new Types.ObjectId(userId),
    });
  }

  async delete(userId: string, { pollId }: PollIdDto) {
    await this.model.findOneAndDelete({
      userId: new Types.ObjectId(userId),
      pollId: new Types.ObjectId(pollId),
    });
  }

  async findOne(userId: string, { pollId, optionId }: VoteDto) {
    return await this.model.findOne({
      userId: new Types.ObjectId(userId),
      pollId: new Types.ObjectId(pollId),
      optionId: new Types.ObjectId(optionId),
    });
  }

  async getTotalVotes(pollId: string) {
    return await this.model.countDocuments({ pollId });
  }
}
