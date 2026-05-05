import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { GlobalHttpException } from 'src/common/exceptions/global-http.exception';
import { DistrictRepository } from '../repositories/district.repository';
import { CreateDistrictDto } from '../dtos/create-district.dto';
import { ProvinceIdDto } from 'src/location/province/dtos/province-id.dto';
import { DistrictIdDto } from '../dtos/district-id.dto';
import { ResponseHelper } from 'src/common/helpers/response.helper';
import { DistrictSerializer } from '../serializers/district.serializer';
import { RedisCacheService } from 'src/common/cache/services/redis-cache.service';

@Injectable()
export class DistrictService {
  private readonly logger = new Logger(DistrictService.name);

  constructor(
    private readonly districtRepo: DistrictRepository,
    private readonly redisCache: RedisCacheService,
  ) {}

  async createDistrict(districtData: CreateDistrictDto) {
    const doesDistrictExists = await this.doesDistrictExists({
      name: districtData.name,
    }).lean();
    if (doesDistrictExists) {
      throw new GlobalHttpException(
        'districtAlreadyExistsWithName',
        HttpStatus.AMBIGUOUS,
      );
    }

    await this.districtRepo.create(districtData);

    await this.redisCache.del('location:districts');
  }

  async getDistricts({
    cursor,
    limit,
  }: {
    cursor?: string;
    limit?: number;
  }) {
    const cacheKey = `location:districts:${cursor || 'initial'}:${limit}`;

    const cached = await this.redisCache.get(cacheKey);
    if (cached) {
      return ResponseHelper.response(
        DistrictSerializer,
        cached,
        'Districts fetched successfully',
      );
    }

    const districts = await this.districtRepo.find({ cursor, limit });

    await this.redisCache.set(cacheKey, districts);

    return ResponseHelper.response(
      DistrictSerializer,
      districts,
      'Districts fetched successfully',
    );
  }

  async getDistrictsByProvinceId(
    provinceIdDto: ProvinceIdDto,
    { cursor, limit }: { cursor?: string; limit?: number },
  ) {
    const data = await this.districtRepo.findByProvinceId(provinceIdDto, {
      cursor,
      limit,
    });
    return ResponseHelper.response(
      DistrictSerializer,
      data,
      'Districts fetched successfully',
    );
  }

  async getDistrictById(districtIdDto: DistrictIdDto) {
    const district = await this.districtRepo.findById(districtIdDto.districtId);
    if (!district) {
      throw new GlobalHttpException('district404', HttpStatus.NOT_FOUND);
    }
    return ResponseHelper.response(
      DistrictSerializer,
      district,
      'District fetched successfully',
    );
  }

  private doesDistrictExists(filter: any) {
    return this.districtRepo.findOne(filter);
  }
}
