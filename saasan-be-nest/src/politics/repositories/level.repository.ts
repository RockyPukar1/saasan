import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { LevelEntity, LevelEntityDocument } from '../entities/level.entity';
import { Model } from 'mongoose';
import { PositionEntity } from 'src/politics/entities/position.entity';
import { PoliticianEntity } from 'src/politics/entities/politician.entity';

@Injectable()
export class LevelRepository {
  constructor(
    @InjectModel(LevelEntity.name)
    private readonly model: Model<LevelEntityDocument>,
  ) {}

  async getLevels() {
    return await this.model.aggregate([
      {
        $lookup: {
          from: 'positions',
          localField: '_id',
          foreignField: 'levelId',
          as: 'positionsForLevel',
        },
      },
      {
        $lookup: {
          from: 'politicians',
          localField: 'positionsForLevel._id',
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
          positionsForLevel: 0,
        },
      },
      {
        $sort: { id: 1 },
      },
    ]);
  }
}
