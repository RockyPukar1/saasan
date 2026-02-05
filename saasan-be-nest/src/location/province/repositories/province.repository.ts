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

  async find() {
    return this.model.find();
  }

  async create(provinceData: CreateProvinceDto) {
    await this.model.create(provinceData);
  }
}
