import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { LevelEntity, LevelEntityDocument } from '../entities/level.entity';
import { Model } from 'mongoose';
import { PositionEntity } from 'src/position/entities/position.entity';
import { PoliticianEntity } from 'src/politician/entities/politician.entity';

@Injectable()
export class LevelRepository {
  constructor(
    @InjectModel(LevelEntity.name)
    private readonly model: Model<LevelEntityDocument>,
  ) {}

  async getGovernmentLevels() {
    return await this.model.aggregate([
      {
        $lookup: {
          from: PositionEntity.name,
          localField: '_id',
          foreignField: 'levelId',
          as: 'positionsForLevel',
        },
      },
      {
        $unwind: {
          path: '$positionsForLevel',
          preserveNullAndEmptyArrays: true, // preserve levels even if no positions are found
        },
      },
      {
        $lookup: {
          from: PoliticianEntity.name,
          localField: 'positionsForLevel.title',
          foreignField: 'position',
          as: 'politiciansForPosition',
        },
      },
      {
        $unwind: {
          path: '$politiciansForPosition',
          preserveNullAndEmptyArrays: true, // preserve levels and positions event if no politicians are found
        },
      },
      {
        $match: {
          $or: [
            { 'politiciansForPosition.isActive': true },
            { politiciansForPosition: { $exists: false } },
          ],
        },
      },
      {
        $group: {
          _id: '$_id',
          name: { $first: '$name' }, // get the original name field
          description: { $first: '$description' },
          activePoliticianIds: {
            $addToSet: {
              $cond: {
                if: '$politiciansForPosition.isActive',
                then: '$politiciansForPosition._id',
                else: '$$REMOVE', // remove if not active
              },
            },
          },
        },
      },
      {
        $project: {
          _id: 0, // exclude the default _id field from the final output
          id: { $toString: '$_id' },
          name: '$name',
          description: '$description',
          count: { $size: '$activePoliticianIds' }, // count the distinct Ids
        },
      },
      {
        $sort: { id: 1 },
      },
    ]);
  }
}
