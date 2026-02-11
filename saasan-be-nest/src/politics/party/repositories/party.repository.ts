import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PartyEntity, PartyEntityDocument } from '../entities/party.entity';
import { Model } from 'mongoose';

@Injectable()
export class PartyRepository {
  constructor(
    @InjectModel(PartyEntity.name)
    private readonly model: Model<PartyEntityDocument>,
  ) {}

  async getParties() {
    return await this.model.aggregate([
      {
        $lookup: {
          from: 'politicians',
          localField: '_id',
          foreignField: 'partyId',
          as: 'politiciansForParty',
        },
      },
      {
        $addFields: {
          count: { $size: '$politiciansForParty' },
        },
      },
      {
        $project: {
          politiciansForParty: 0,
        },
      },
    ]);
  }
}
