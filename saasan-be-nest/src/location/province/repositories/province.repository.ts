import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ProvinceEntity,
  ProvinceEntityDocument,
} from '../entities/province.entity';
import { CreateProvinceDto } from '../dtos/create-province.dto';
import {
  descendingObjectIdCursorFilter,
  toCursorPaginatedResult,
} from 'src/common/helpers/cursor-pagination.helper';

export class ProvinceRepository {
  constructor(
    @InjectModel(ProvinceEntity.name)
    private readonly model: Model<ProvinceEntityDocument>,
  ) {}

  async findOne(filter: any) {
    return this.model.findOne(filter);
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
        .limit(limit + 1),
      this.model.countDocuments(baseFilter),
    ]);
    return toCursorPaginatedResult(data, limit, total);
  }

  async findById(provinceId: string) {
    return this.model.findById(provinceId);
  }

  async create(provinceData: CreateProvinceDto) {
    await this.model.create(provinceData);
  }
}
