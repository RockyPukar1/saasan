import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  PoliticianEntity,
  PoliticianEntityDocument,
} from '../entities/politician.entity';
import { Model } from 'mongoose';
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
    return await this.model.find();
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
              position: '$positions.title',
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
