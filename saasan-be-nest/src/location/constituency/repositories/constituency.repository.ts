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
import {
  descendingObjectIdCursorFilter,
  toCursorPaginatedResult,
} from 'src/common/helpers/cursor-pagination.helper';

export class ConstituencyRepository {
  constructor(
    @InjectModel(ConstituencyEntity.name)
    private readonly model: Model<ConstituencyEntityDocument>,
  ) {}

  findOne(filter: any) {
    return this.model.findOne(filter);
  }

  async findOneByWardId({ wardId }: WardIdDto) {
    return (
      (
        await this.model.aggregate([
          {
            $lookup: {
              from: 'wards',
              localField: '_id',
              foreignField: 'constituencyId',
              as: 'ward',
            },
          },
          {
            $match: {
              'ward._id': new Types.ObjectId(wardId),
            },
          },
        ])
      )[0] || null
    );
  }

  async find({ cursor, limit = 10 }: { cursor?: string; limit?: number }) {
    const baseFilter = {};
    const cursorFilter = descendingObjectIdCursorFilter(cursor);
    const [data, total] = await Promise.all([
      this.model
        .find({
          ...baseFilter,
          ...cursorFilter,
        })
        .sort({ _id: -1 })
        .limit(limit + 1)
        .populate(['provinceId', 'districtId']),
      this.model.countDocuments(baseFilter),
    ]);
    return toCursorPaginatedResult(data, limit, total);
  }

  async findById(id: string) {
    return await this.model.findById(id);
  }

  async findByProvinceId(
    { provinceId }: ProvinceIdDto,
    { cursor, limit = 10 }: { cursor?: string; limit?: number },
  ) {
    const baseFilter = {
      provinceId: new Types.ObjectId(provinceId),
    };
    const cursorFilter = descendingObjectIdCursorFilter(cursor);
    const [data, total] = await Promise.all([
      this.model
        .find({
          ...baseFilter,
          ...cursorFilter,
        })
        .sort({ _id: -1 })
        .limit(limit + 1)
        .populate('districtId'),
      this.model.countDocuments(baseFilter),
    ]);
    return toCursorPaginatedResult(data, limit, total);
  }

  async findByDistrictId(
    { districtId }: DistrictIdDto,
    { cursor, limit = 10 }: { cursor?: string; limit?: number },
  ) {
    const baseFilter = {
      districtId: new Types.ObjectId(districtId),
    };
    const cursorFilter = descendingObjectIdCursorFilter(cursor);
    const [data, total] = await Promise.all([
      this.model
        .find({
          ...baseFilter,
          ...cursorFilter,
        })
        .sort({ _id: -1 })
        .limit(limit + 1)
        .populate('districtId'),
      this.model.countDocuments(baseFilter),
    ]);
    return toCursorPaginatedResult(data, limit, total);
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
