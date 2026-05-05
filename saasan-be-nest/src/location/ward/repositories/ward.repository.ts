import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { WardEntity, WardEntityDocument } from '../entities/ward.entity';
import { CreateWardDto } from '../dtos/create-ward.dto';
import { MunicipalityIdDto } from 'src/location/municipality/dtos/municipality-id.dto';
import { ProvinceIdDto } from 'src/location/province/dtos/province-id.dto';
import { DistrictIdDto } from 'src/location/district/dtos/district-id.dto';
import {
  descendingObjectIdCursorFilter,
  toCursorPaginatedResult,
} from 'src/common/helpers/cursor-pagination.helper';

export class WardRepository {
  constructor(
    @InjectModel(WardEntity.name)
    private readonly model: Model<WardEntityDocument>,
  ) {}

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
        .populate([
          'provinceId',
          'districtId',
          'municipalityId',
          'constituencyId',
        ]),
      this.model.countDocuments(baseFilter),
    ]);
    return toCursorPaginatedResult(data, limit, total);
  }

  findOne(filter: any) {
    return this.model.findOne(filter);
  }

  async findById(wardId: string) {
    return await this.model.findById(wardId);
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
        .populate(['municipalityId', 'constituencyId']),
      this.model.countDocuments(baseFilter),
    ]);
    return toCursorPaginatedResult(data, limit, total);
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
        .populate(['districtId', 'municipalityId', 'constituencyId']),
      this.model.countDocuments(baseFilter),
    ]);
    return toCursorPaginatedResult(data, limit, total);
  }

  async findByMunicipalityId(
    { municipalityId }: MunicipalityIdDto,
    { cursor, limit = 10 }: { cursor?: string; limit?: number },
  ) {
    const baseFilter = {
      municipalityId: new Types.ObjectId(municipalityId),
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
        .populate([
          'provinceId',
          'districtId',
          'municipalityId',
          'constituencyId',
        ]),
      this.model.countDocuments(baseFilter),
    ]);
    return toCursorPaginatedResult(data, limit, total);
  }

  async create(wardData: CreateWardDto) {
    await this.model.create(wardData);
  }
}
