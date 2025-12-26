import { Injectable } from '@nestjs/common';

import eventData from './data/event.json';
import { InjectModel } from '@nestjs/mongoose';
import {
  EventEntity,
  EventEntityDocument,
} from 'src/event/entities/event.entity';
import { Model } from 'mongoose';

@Injectable()
export class EventSeeder {
  constructor(
    @InjectModel(EventEntity.name)
    private readonly eventModel: Model<EventEntityDocument>,
  ) {}

  async seed() {
    console.log('Seeding event...');
    await this.eventModel.insertMany(eventData);
    console.log('Event seeded successfully');
  }
}
