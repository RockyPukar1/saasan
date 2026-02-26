import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ProvinceEntity,
  ProvinceEntityDocument,
} from '../entities/province.entity';
import { CreateProvinceDto } from '../dtos/create-province.dto';

export class ProvinceRepository {
  constructor(
    @InjectModel(ProvinceEntity.name)
    private readonly model: Model<ProvinceEntityDocument>,
  ) {}

  async findOne(filter: any) {
    return this.model.findOne(filter);
  }

  async find({ page = 1, limit = 10 }) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.model.find().skip(skip).limit(limit),
      this.model.countDocuments(),
    ]);
    return { data, total, page, limit };
  }

  async findById(provinceId: string) {
    return this.model.findById(provinceId);
  }

  async create(provinceData: CreateProvinceDto) {
    await this.model.create(provinceData);
  }
}
