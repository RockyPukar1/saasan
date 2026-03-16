import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PartyEntity, PartyEntityDocument } from '../entities/party.entity';
import { Model, Types } from 'mongoose';
import { CreatePartyDto, UpdatePartyDto } from '../serializers/party.dto';

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

  async getPartyById(id: string) {
    return await this.model
      .aggregate([
        {
          $match: { _id: new Types.ObjectId(id) },
        },
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
      ])
      .then((results) => results[0]);
  }

  async createParty(createPartyDto: CreatePartyDto) {
    const party = new this.model(createPartyDto);
    return await party.save();
  }

  async updateParty(id: string, updatePartyDto: UpdatePartyDto) {
    return await this.model
      .findByIdAndUpdate(
        id,
        { ...updatePartyDto },
        { new: true, runValidators: true },
      )
      .exec();
  }

  async deleteParty(id: string) {
    const result = await this.model.findByIdAndDelete(id);
    return !!result;
  }

  async getPoliticiansByParty(partyId: string) {
    return await this.model.aggregate([
      {
        $match: {
          partyId: new Types.ObjectId(partyId),
        },
      },
      {
        $lookup: {
          from: 'government-levels',
          localField: '_id',
          foreignField: 'levelId',
          as: 'level',
        },
      },
      {
        $lookup: {
          from: 'positions',
          localField: 'positionId',
          foreignField: '_id',
          as: 'position',
        },
      },
      {
        $project: {
          partyName: { $first: '$party.abbreviation' },
          positionName: { $first: '$position.name' },
          levelName: { $first: '$level.name' },
        },
      },
      {
        $group: {
          _id: null,
          docs: { $push: '$$ROOT' },
        },
      },
      {
        $project: {
          _id: 0,
          docs: 1,
        },
      },
    ]);
  }
}
