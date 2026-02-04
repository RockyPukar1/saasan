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

  async getEventsOnThisDay() {
    const today = new Date();
    const currentMonth = today.getMonth() + 1; // getMonth() returns 0-11
    const currentDay = today.getDate();
    
    return await this.model.find({
      $expr: {
        $and: [
          { $eq: [{ $month: '$date' }, currentMonth] },
          { $eq: [{ $dayOfMonth: '$date' }, currentDay] }
        ]
      }
    });
  }
}
