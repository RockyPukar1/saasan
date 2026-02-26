import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  ConstituencyEntity,
  ConstituencyEntityDocument,
} from '../entities/constituency.entity';
import { CreateConstituencyDto } from '../dtos/create-constituency.dto';
import { WardIdDto } from 'src/location/ward/dtos/ward-id.dto';
import { ProvinceIdDto } from 'src/location/province/dtos/province-id.dto';
import { DistrictIdDto } from 'src/location/district/dtos/district-id.dto';

export class ConstituencyRepository {
  constructor(
    @InjectModel(ConstituencyEntity.name)
    private readonly model: Model<ConstituencyEntityDocument>,
  ) {}

  findOne(filter: any) {
    return this.model.findOne(filter);
  }

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

  async findById(id: string) {
    return await this.model.findById(id);
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

  async findByDistrictId(
    { districtId }: DistrictIdDto,
    { page = 1, limit = 10 },
  ) {
    const skip = (page - 1) * limit;
    const filter = {
      districtId: new Types.ObjectId(districtId),
    };
    const [data, total] = await Promise.all([
      this.model.find(filter).skip(skip).limit(limit).populate('districtId'),
      this.model.countDocuments(filter),
    ]);
    return { data, total, page, limit };
  }

  async findConstituencyByWardId({ wardId }: WardIdDto) {
    const ward = await this.model.findOne({
      wardId: new Types.ObjectId(wardId),
    });
    return ward;
  }

  async create(constituencyData: CreateConstituencyDto) {
    await this.model.create(constituencyData);
  }
}
