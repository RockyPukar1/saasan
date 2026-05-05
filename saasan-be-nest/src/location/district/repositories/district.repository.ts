import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  DistrictEntity,
  DistrictEntityDocument,
} from '../entities/district.entity';
import { CreateDistrictDto } from '../dtos/create-district.dto';
import { ProvinceIdDto } from 'src/location/province/dtos/province-id.dto';
import {
  descendingObjectIdCursorFilter,
  toCursorPaginatedResult,
} from 'src/common/helpers/cursor-pagination.helper';

export class DistrictRepository {
  constructor(
    @InjectModel(DistrictEntity.name)
    private readonly model: Model<DistrictEntityDocument>,
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
        .populate('provinceId'),
      this.model.countDocuments(baseFilter),
    ]);
    return toCursorPaginatedResult(data, limit, total);
  }

  findOne(filter: any) {
    return this.model.findOne(filter);
  }

  async findById(districtId: string) {
    return this.model.findById(districtId);
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
        .limit(limit + 1),
      this.model.countDocuments(baseFilter),
    ]);
    return toCursorPaginatedResult(data, limit, total);
  }

  async create(districtData: CreateDistrictDto) {
    await this.model.create(districtData);
  }
}
