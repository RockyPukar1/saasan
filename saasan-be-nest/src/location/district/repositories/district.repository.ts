import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  DistrictEntity,
  DistrictEntityDocument,
} from '../entities/district.entity';
import { CreateDistrictDto } from '../dtos/create-district.dto';
import { ProvinceIdDto } from 'src/location/province/dtos/province-id.dto';

export class DistrictRepository {
  constructor(
    @InjectModel(DistrictEntity.name)
    private readonly model: Model<DistrictEntityDocument>,
  ) {}

  findOne(filter: any) {
    return this.model.findOne(filter);
  }

  async findByProvinceId({ provinceId }: ProvinceIdDto) {
    return await this.model.find({
      provinceId: new Types.ObjectId(provinceId)
    });
  }

  async create(districtData: CreateDistrictDto) {
    await this.model.create(districtData);
  }
}
