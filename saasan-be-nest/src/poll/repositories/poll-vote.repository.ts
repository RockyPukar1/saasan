import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model, Types } from 'mongoose';
import {
  PollVoteEntity,
  PollVoteEntityDocument,
} from '../entities/poll-vote.entity';
import { VoteDto } from '../dtos/vote.dto';
import { PollIdDto } from '../dtos/poll-id.dto';

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

  async deleteByPollId(pollId: string) {
    await this.model.deleteMany({ pollId: new Types.ObjectId(pollId) });
  }

  async getAnalyticsSummary() {
    const pollsCollection = this.model.collection.conn.db!.collection('polls');

    const [totalPolls, activePolls, totalVotes] = await Promise.all([
      pollsCollection.countDocuments(),
      pollsCollection.countDocuments({ status: 'active' }),
      this.model.countDocuments(),
    ]);

    return {
      totalPolls,
      activePolls,
      totalVotes,
    };
  }
}
