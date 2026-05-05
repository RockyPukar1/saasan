import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  MunicipalityEntity,
  MunicipalityEntityDocument,
} from '../entities/municipality.entity';
import { CreateMunicipalityDto } from '../dtos/create-municipality.dto';
import { DistrictIdDto } from 'src/location/district/dtos/district-id.dto';
import { ProvinceIdDto } from 'src/location/province/dtos/province-id.dto';
import {
  descendingObjectIdCursorFilter,
  toCursorPaginatedResult,
} from 'src/common/helpers/cursor-pagination.helper';

export class MunicipalityRepository {
  constructor(
    @InjectModel(MunicipalityEntity.name)
    private readonly model: Model<MunicipalityEntityDocument>,
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
        .populate(['provinceId', 'districtId']),
      this.model.countDocuments(baseFilter),
    ]);
    return toCursorPaginatedResult(data, limit, total);
  }

  findOne(filter: any) {
    return this.model.findOne(filter);
  }

  async findById(municipalityId: string) {
    return this.model.findById(municipalityId);
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
        .limit(limit + 1),
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
        .populate('districtId'),
      this.model.countDocuments(baseFilter),
    ]);
    return toCursorPaginatedResult(data, limit, total);
  }

  async create(municipalityData: CreateMunicipalityDto) {
    await this.model.create(municipalityData);
  }
}
