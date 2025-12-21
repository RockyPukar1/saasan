import { Model } from 'mongoose';
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

  async updateOne(id: string, data: any) {
    return await this.model.findByIdAndUpdate(id, {
      $set: data,
    });
  }
}
