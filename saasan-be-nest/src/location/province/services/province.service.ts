import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { GlobalHttpException } from 'src/common/exceptions/global-http.exception';
import { ProvinceRepository } from '../repositories/province.repository';
import { CreateProvinceDto } from '../dtos/create-province.dto';
import { ResponseHelper } from 'src/common/helpers/response.helper';
import { ProvinceSerializer } from '../serializers/province.serializer';
import { ProvinceIdDto } from '../dtos/province-id.dto';
import { RedisCacheService } from 'src/common/cache/services/redis-cache.service';

@Injectable()
export class ProvinceService {
  private readonly logger = new Logger(ProvinceService.name);

  constructor(
    private readonly provinceRepo: ProvinceRepository,
    private readonly redisCache: RedisCacheService,
  ) {}

  async createProvince(provinceData: CreateProvinceDto) {
    const doesProvinceExists = await this.doesProvinceExists({
      name: provinceData.name,
      provinceNumber: provinceData.provinceNumber,
    });
    if (doesProvinceExists) {
      throw new GlobalHttpException(
        'provinceAlreadyExistsWithNameOrProvinceNumber',
        HttpStatus.AMBIGUOUS,
      );
    }

    await this.provinceRepo.create(provinceData);

    await this.redisCache.del('location:provinces');
  }

  async getProvinces({
    cursor,
    limit = 10,
  }: {
    cursor?: string;
    limit?: number;
  }) {
    const cacheKey = `location:provinces:${cursor || 'initial'}:${limit}`;

    const cached = await this.redisCache.get(cacheKey);
    if (cached) {
      return ResponseHelper.response(
        ProvinceSerializer,
        cached,
        'Provinces fetched successfully',
      );
    }

    const provinces = await this.provinceRepo.find({ cursor, limit });

    await this.redisCache.set(cacheKey, provinces);

    return ResponseHelper.response(
      ProvinceSerializer,
      provinces,
      'Provinces fetched successfully',
    );
  }

  async getProvinceById(provinceIdDto: ProvinceIdDto) {
    const province = await this.provinceRepo.findById(provinceIdDto.provinceId);
    if (!province)
      throw new GlobalHttpException('province404', HttpStatus.NOT_FOUND);
    return ResponseHelper.response(
      ProvinceSerializer,
      province,
      'Province fetched successfully',
    );
  }

  private doesProvinceExists(filter: any) {
    return this.provinceRepo.findOne(filter);
  }
}
