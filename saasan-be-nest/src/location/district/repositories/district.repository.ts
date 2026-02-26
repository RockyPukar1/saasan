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

  async find({ page = 1, limit = 10 }) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.model.find().skip(skip).limit(limit).populate('provinceId'),
      this.model.countDocuments(),
    ]);
    return { data, total, page, limit };
  }

  findOne(filter: any) {
    return this.model.findOne(filter);
  }

  async findById(districtId: string) {
    return this.model.findById(districtId);
  }

  async findByProvinceId(
    { provinceId }: ProvinceIdDto,
    { page = 1, limit = 10 },
  ) {
    const skip = (page - 1) * limit;
    const filter = {
      provinceId: new Types.ObjectId(provinceId),
    };
    const [data, total] = await Promise.all([
      this.model.find(filter).skip(skip).limit(limit),
      this.model.countDocuments(filter),
    ]);
    return { data, total, page, limit };
  }

  async create(districtData: CreateDistrictDto) {
    await this.model.create(districtData);
  }
}
