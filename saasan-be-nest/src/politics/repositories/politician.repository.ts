import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  PoliticianEntity,
  PoliticianEntityDocument,
} from '../entities/politician.entity';
import { Model, Types } from 'mongoose';
import { CreatePoliticianDto } from '../dtos/create-politician.dto';
import { UpdatePoliticianDto } from '../dtos/update-politician.dto';
import { LevelNameDto } from '../dtos/level-name.dto';
import { PoliticianFilterDto } from '../dtos/politician-filter.dto';

@Injectable()
export class PoliticianRepository {
  constructor(
    @InjectModel(PoliticianEntity.name)
    private readonly model: Model<PoliticianEntityDocument>,
  ) {}

  async create(politicianData: CreatePoliticianDto) {
    this.model.create(politicianData);
  }

  async getAll(politicianFilterDto: PoliticianFilterDto) {
    const partyIds = (politicianFilterDto.party || []).map(
      (id) => new Types.ObjectId(id),
    );
    const positionIds = (politicianFilterDto.position || []).map(
      (id) => new Types.ObjectId(id),
    );
    const levelIds = (politicianFilterDto.level || []).map(
      (id) => new Types.ObjectId(id),
    );

    const hasFilters =
      partyIds.length > 0 || positionIds.length > 0 || levelIds.length > 0;

    return await this.model.aggregate([
      ...(hasFilters
        ? [
            {
              $match: {
                $or: [
                  { partyId: { $in: partyIds } },
                  { positionIds: { $in: positionIds } },
                ],
              },
            },
          ]
        : []),
      {
        $lookup: {
          from: 'positions',
          localField: 'positionIds',
          foreignField: '_id',
          as: 'positionData',
        },
      },
      {
        $lookup: {
          from: 'levels',
          localField: 'positionData.levelId',
          foreignField: '_id',
          as: 'levelData',
        },
      },
      ...(hasFilters
        ? [
            {
              $match: { 'positionData.levelId': { $in: levelIds } },
            },
          ]
        : []),
      {
        $lookup: {
          from: 'parties',
          localField: 'partyId',
          foreignField: '_id',
          as: 'partyData',
        },
      },
      {
        $addFields: {
          sourceCategories: {
            party: { $arrayElemAt: ['$partyData.abbreviation', 0] },
            positions: {
              $map: {
                input: '$positionData',
                as: 'pos',
                in: '$$pos.abbreviation',
              },
            },
            levels: {
              $map: {
                input: '$levelData',
                as: 'lvl',
                in: '$$lvl.name',
              },
            },
          },
        },
      },
      {
        $project: {
          partyData: 0,
          positionData: 0,
          levelData: 0,
        },
      },
    ]);
  }

  findOne(filter: any) {
    return this.model.findOne(filter);
  }

  async findByIdAndUpdate(
    politicianId: string,
    politicianData: UpdatePoliticianDto,
  ) {
    return await this.model.findByIdAndUpdate(politicianId, politicianData, {
      lean: true,
      new: true,
    });
  }

  async findByIdAndDelete(politicianId: string) {
    await this.model.findByIdAndDelete(politicianId);
  }

  async getTotalPoliticians() {
    return await this.countDocuments();
  }

  async getTotalActivePoliticians() {
    return await this.countDocuments({
      isActive: true,
    });
  }

  async getByLevel({ levelName }: LevelNameDto) {
    return await this.model.aggregate([
      {
        $lookup: {
          from: 'positions',
          localField: 'positionIds',
          foreignField: '_id',
          as: 'positions',
        },
      },
      {
        $unwind: '$positions',
      },
      {
        $lookup: {
          from: 'levels',
          localField: 'positions.levelId',
          foreignField: '_id',
          as: 'level',
        },
      },
      {
        $unwind: '$level',
      },
      {
        $match: {
          'level.name': { $regex: levelName, $options: 'i' },
        },
      },
      {
        $lookup: {
          from: 'parties',
          localField: 'partyId',
          foreignField: '_id',
          as: 'party',
        },
      },
      {
        $unwind: {
          path: '$party',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'constituencies',
          localField: 'constituencyId',
          foreignField: '_id',
          as: 'constituency',
        },
      },
      {
        $unwind: {
          path: '$constituency',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: '$_id',
          fullName: { $first: '$fullName' },
          partyName: { $first: '$party.abbreviation' },
          constituencyNumber: { $first: '$constituency.constituencyNumber' },
          posts: {
            $push: {
              level: '$level.name',
              position: '$positions.name',
            },
          },
        },
      },
      {
        $project: {
          fullName: 1,
          posts: 1,
          partyName: 1,
          constituencyNumber: 1,
        },
      },
    ]);
  }

  private async countDocuments(filter?: any) {
    return await this.model.countDocuments(filter);
  }
}
