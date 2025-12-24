import { Injectable } from '@nestjs/common';

import pollData from './data/poll.json';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PollEntity, PollEntityDocument } from 'src/poll/entities/poll.entity';
import {
  PollOptionEntity,
  PollOptionEntityDocument,
} from 'src/poll/entities/poll-option.entity';

@Injectable()
export class PollSeeder {
  constructor(
    @InjectModel(PollEntity.name)
    private readonly pollModel: Model<PollEntityDocument>,
    @InjectModel(PollOptionEntity.name)
    private readonly pollOptionModel: Model<PollOptionEntityDocument>,
  ) {}

  async seed() {
    console.log('Seeding poll...');

    for (const poll of pollData) {
      const pollDoc = await this.pollModel.findOneAndUpdate(
        { title: poll.title },
        {
          $set: {
            title: poll.title,
            description: poll.description,
            startDate: poll.startDate,
            endDate: poll.endDate,
          },
        },
        { upsert: true, new: true },
      );

      if (!poll.options?.length) return;
      const pollId = pollDoc._id;
      const options = poll.options;

      const optionsPromises = options.map((text) =>
        this.pollOptionModel.findOneAndUpdate(
          { text },
          {
            $set: {
              pollId,
              text,
            },
          },
          { upsert: true, new: true },
        ),
      );

      const createdOptionsIds = (await Promise.all(optionsPromises)).map(
        (option) => option._id,
      );

      await this.pollModel.findByIdAndUpdate(
        pollId,
        {
          $set: {
            options: createdOptionsIds,
          },
        },
        { upsert: true, new: true },
      );
    }

    console.log('Poll seeded successfully');
  }
}
