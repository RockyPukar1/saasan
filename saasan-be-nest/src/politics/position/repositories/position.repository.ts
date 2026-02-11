import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  PositionEntity,
  PositionEntityDocument,
} from '../entities/position.entity';
import { Model } from 'mongoose';

@Injectable()
export class PositionRepository {
  constructor(
    @InjectModel(PositionEntity.name)
    private readonly model: Model<PositionEntityDocument>,
  ) {}

  async getPositions() {
    return await this.model.aggregate([
      {
        $lookup: {
          from: 'politicians',
          localField: '_id',
          foreignField: 'positionIds',
          as: 'politiciansForPosition',
        },
      },
      {
        $addFields: {
          count: { $size: '$politiciansForPosition' },
        },
      },
      {
        $project: {
          politiciansForPosition: 0,
        },
      },
    ]);
  }
}
