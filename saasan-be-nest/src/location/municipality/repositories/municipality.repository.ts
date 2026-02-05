import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  MunicipalityEntity,
  MunicipalityEntityDocument,
} from '../entities/municipality.entity';
import { CreateMunicipalityDto } from '../dtos/create-municipality.dto';
import { DistrictIdDto } from 'src/location/district/dtos/district-id.dto';

export class MunicipalityRepository {
  constructor(
    @InjectModel(MunicipalityEntity.name)
    private readonly model: Model<MunicipalityEntityDocument>,
  ) {}

  findOne(filter: any) {
    return this.model.findOne(filter);
  }

  async findByDistrictId({ districtId }: DistrictIdDto) {
    return await this.model.find({
      districtId: new Types.ObjectId(districtId),
    });
  }

  async create(municipalityData: CreateMunicipalityDto) {
    await this.model.create(municipalityData);
  }
}
