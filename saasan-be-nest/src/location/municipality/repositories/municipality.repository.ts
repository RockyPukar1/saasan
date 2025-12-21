import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  MunicipalityEntity,
  MunicipalityEntityDocument,
} from '../entities/municipality.entity';
import { CreateMunicipalityDto } from '../dtos/create-municipality.dto';

export class MunicipalityRepository {
  constructor(
    @InjectModel(MunicipalityEntity.name)
    private readonly model: Model<MunicipalityEntityDocument>,
  ) {}

  findOne(filter: any) {
    return this.model.findOne(filter);
  }

  async create(municipalityData: CreateMunicipalityDto) {
    await this.model.create(municipalityData);
  }
}
