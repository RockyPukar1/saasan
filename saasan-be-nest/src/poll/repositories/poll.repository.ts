import { ClientSession, Model, Types } from 'mongoose';
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

  async getAll(userId: string) {
    return await this.model.aggregate([
      {
        $match: { status: 'active' },
      },
      {
        $lookup: {
          from: 'poll-options',
          localField: '_id',
          foreignField: 'pollId',
          as: 'options',
        },
      },
      {
        $lookup: {
          from: 'poll-votes',
          foreignField: 'pollId',
          localField: '_id',
          as: 'allVotes',
        },
      },
      {
        $addFields: {
          totalVotes: { $size: '$allVotes' },
          options: {
            $map: {
              input: '$options',
              as: 'opt',
              in: {
                $mergeObjects: [
                  '$$opt',
                  {
                    voteCount: {
                      $size: {
                        $filter: {
                          input: '$allVotes',
                          as: 'v',
                          cond: { $eq: ['$$v.optionId', '$$opt._id'] },
                        },
                      },
                    },
                    isVoted: {
                      $anyElementTrue: {
                        $map: {
                          input: '$allVotes',
                          as: 'v',
                          in: {
                            $and: [
                              {
                                $eq: ['$$v.userId', new Types.ObjectId(userId)],
                              },
                              { $eq: ['$$v.optionId', '$$opt._id'] },
                            ],
                          },
                        },
                      },
                    },
                  },
                ],
              },
            },
          },
        },
      },
      {
        $project: { allVotes: 0 },
      },
      {
        $sort: { createdAt: -1 },
      },
    ]);
  }

  async create(pollData: Omit<CreatePollDto, 'options'>) {
    return await this.model.create(pollData);
  }

  async findById(pollId: string) {
    return await this.model.findById(pollId);
  }

  async getDetailsById(pollId: string, userId: string) {
    const data = await this.model.aggregate([
      {
        $match: {
          _id: new Types.ObjectId(pollId),
        },
      },
      {
        $lookup: {
          from: 'poll-options',
          localField: '_id',
          foreignField: 'pollId',
          as: 'options',
        },
      },
      {
        $lookup: {
          from: 'poll-votes',
          foreignField: 'pollId',
          localField: '_id',
          as: 'allVotes',
        },
      },
      {
        $addFields: {
          totalVotes: { $size: '$allVotes' },
          options: {
            $map: {
              input: '$options',
              as: 'opt',
              in: {
                $mergeObjects: [
                  '$$opt',
                  {
                    voteCount: {
                      $size: {
                        $filter: {
                          input: '$allVotes',
                          as: 'v',
                          cond: { $eq: ['$$v.optionId', '$$opt._id'] },
                        },
                      },
                    },
                    isVoted: {
                      $anyElementTrue: {
                        $map: {
                          input: '$allVotes',
                          as: 'v',
                          in: {
                            $and: [
                              {
                                $eq: ['$$v.userId', new Types.ObjectId(userId)],
                              },
                              { $eq: ['$$v.optionId', '$$opt._id'] },
                            ],
                          },
                        },
                      },
                    },
                  },
                ],
              },
            },
          },
        },
      },
      {
        $project: { allVotes: 0 },
      },
    ]);
    return data[0] || null;
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
