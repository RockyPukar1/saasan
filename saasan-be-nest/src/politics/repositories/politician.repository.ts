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

@Injectable()
export class PoliticianRepository {
  private levelMapping: Record<string, string> = {
    federal: 'Federal',
    provincial: 'Provincial',
    district: 'District',
    municipal: 'Municipal',
    ward: 'Ward',
  };

  constructor(
    @InjectModel(PoliticianEntity.name)
    private readonly model: Model<PoliticianEntityDocument>,
  ) {}

  async create(politicianData: CreatePoliticianDto) {
    this.model.create(politicianData);
  }

  async getAll() {
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
          localField: 'positionId',
          foreignField: '_id',
          as: 'position',
        },
      },
      {
        $unwind: '$position',
      },
      {
        $lookup: {
          from: 'levels',
          localField: 'position.level',
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
        $project: {
          fullName: 1,

          positionTitle: '$position.title',
          partyName: '$party.name',
          constituencyName: '$constituency.constituencyNumber',
          levelName: '$level.name',
        },
      },
    ]);
  }

  private async countDocuments(filter?: any) {
    return await this.model.countDocuments(filter);
  }
}
