import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { WardEntity, WardEntityDocument } from '../entities/ward.entity';
import { CreateWardDto } from '../dtos/create-ward.dto';
import { MunicipalityIdDto } from 'src/location/municipality/dtos/municipality-id.dto';
import { ProvinceIdDto } from 'src/location/province/dtos/province-id.dto';
import { DistrictIdDto } from 'src/location/district/dtos/district-id.dto';

export class WardRepository {
  constructor(
    @InjectModel(WardEntity.name)
    private readonly model: Model<WardEntityDocument>,
  ) {}

  async find({ page = 1, limit = 10 }) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.model
        .find()
        .skip(skip)
        .limit(limit)
        .populate([
          'provinceId',
          'districtId',
          'municipalityId',
          'constituencyId',
        ]),
      this.model.countDocuments(),
    ]);
    return { data, total, page, limit };
  }

  findOne(filter: any) {
    return this.model.findOne(filter);
  }

  async findById(wardId: string) {
    return await this.model.findById(wardId);
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
      this.model
        .find(filter)
        .skip(skip)
        .limit(limit)
        .populate(['municipalityId', 'constituencyId']),
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
      this.model
        .find(filter)
        .skip(skip)
        .limit(limit)
        .populate(['districtId', 'municipalityId', 'constituencyId']),
      this.model.countDocuments(filter),
    ]);
    return { data, total, page, limit };
  }

  async findByMunicipalityId(
    { municipalityId }: MunicipalityIdDto,
    { page = 1, limit = 10 },
  ) {
    const skip = (page - 1) * limit;
    const filter = {
      municipalityId: new Types.ObjectId(municipalityId),
    };
    const [data, total] = await Promise.all([
      this.model
        .find(filter)
        .skip(skip)
        .limit(limit)
        .populate([
          'provinceId',
          'districtId',
          'municipalityId',
          'constituencyId',
        ]),
      this.model.countDocuments(filter),
    ]);
    return { data, total, page, limit };
  }

  async create(wardData: CreateWardDto) {
    await this.model.create(wardData);
  }
}
