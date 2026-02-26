import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  MunicipalityEntity,
  MunicipalityEntityDocument,
} from '../entities/municipality.entity';
import { CreateMunicipalityDto } from '../dtos/create-municipality.dto';
import { DistrictIdDto } from 'src/location/district/dtos/district-id.dto';
import { ProvinceIdDto } from 'src/location/province/dtos/province-id.dto';

export class MunicipalityRepository {
  constructor(
    @InjectModel(MunicipalityEntity.name)
    private readonly model: Model<MunicipalityEntityDocument>,
  ) {}

  async find({ page = 1, limit = 10 }) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.model
        .find()
        .skip(skip)
        .limit(limit)
        .populate(['provinceId', 'districtId']),
      this.model.countDocuments(),
    ]);
    return { data, total, page, limit };
  }

  findOne(filter: any) {
    return this.model.findOne(filter);
  }

  async findById(municipalityId: string) {
    return this.model.findById(municipalityId);
  }

  async findByDistrictId(
    { districtId }: DistrictIdDto,
    { page = 1, limit = 10 },
  ) {
    const skip = (page - 1) * limit;
    const filter = {
      districtId: new Types.ObjectId(districtId),
    };
    const [data, total] = await Promise.all([
      this.model.find(filter).skip(skip).limit(limit),
      this.model.countDocuments(filter),
    ]);
    return { data, total, page, limit };
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
      this.model.find(filter).skip(skip).limit(limit).populate('districtId'),
      this.model.countDocuments(filter),
    ]);
    return { data, total, page, limit };
  }

  async create(municipalityData: CreateMunicipalityDto) {
    await this.model.create(municipalityData);
  }
}
