import { ClientSession, Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PollEntity, PollEntityDocument } from '../entities/poll.entity';
import { CreatePollDto } from '../dtos/create-poll.dto';

@Injectable()
export class PollRepository {
  constructor(
    @InjectModel(PollEntity.name)
    private readonly model: Model<PollEntityDocument>,
  ) {}

  async getAll() {
    return await this.model
      .find()
      .populate('options', 'text voteCount _id percentage');
  }

  async create(pollData: Omit<CreatePollDto, 'options'>) {
    return await this.model.create(pollData);
  }

  async findById(pollId: string) {
    return await this.model.findById(pollId);
  }

  findOne(filter: any) {
    return this.model.findOne(filter);
  }

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

  async updateOne(id: string, data: any) {
    return await this.model.findByIdAndUpdate(id, {
      $set: data,
    });
  }

  async getAnalytics() {}

  async getCategories() {
    const categories = await this.model.aggregate([
      { $match: { category: { $ne: null } } },
      { $group: { _id: '$category' } },
      { $sort: { _id: 1 } },
      { $project: { _id: 0, category: '$_id' } },
    ]);

    return categories.map((item) => item.category);
  }

  async getStatuses() {
    const statuses = await this.model.aggregate([
      { $match: { status: { $ne: null } } },
      { $group: { _id: '$status' } },
      { $sort: { _id: 1 } },
      { $project: { _id: 0, status: '$_id' } },
    ]);

    return statuses.map((item) => item.status);
  }

  async getTypes() {
    const types = await this.model.aggregate([
      { $match: { type: { $ne: null } } },
      { $group: { _id: '$type' } },
      { $sort: { _id: 1 } },
      { $project: { _id: 0, type: '$_id' } },
    ]);

    return types.map((item) => item.type);
  }
}
