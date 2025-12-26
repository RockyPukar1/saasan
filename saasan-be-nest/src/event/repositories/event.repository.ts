import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { EventEntity, EventEntityDocument } from '../entities/event.entity';

@Injectable()
export class EventRepository {
  constructor(
    @InjectModel(EventEntity.name)
    private readonly model: Model<EventEntityDocument>,
  ) {}

  async getAll() {
    return await this.model.find();
  }

  async getRecentEvents() {
    return await this.model.find().sort({ createdAt: -1 }).limit(5);
  }
}
