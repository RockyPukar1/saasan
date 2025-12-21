import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  DistrictEntity,
  DistrictEntityDocument,
} from '../entities/district.entity';
import { CreateDistrictDto } from '../dtos/create-district.dto';

export class DistrictRepository {
  constructor(
    @InjectModel(DistrictEntity.name)
    private readonly model: Model<DistrictEntityDocument>,
  ) {}

  findOne(filter: any) {
    return this.model.findOne(filter);
  }

  async create(districtData: CreateDistrictDto) {
    await this.model.create(districtData);
  }
}
