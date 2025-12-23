import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  PoliticianEntity,
  PoliticianEntityDocument,
} from '../entities/politician.entity';
import { Model } from 'mongoose';
import { CreatePoliticianDto } from '../dtos/create-politician.dto';
import { UpdatePoliticianDto } from '../dtos/update-politician.dto';

@Injectable()
export class PoliticianRepository {
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

  private async countDocuments(filter?: any) {
    return await this.model.countDocuments(filter);
  }
}
