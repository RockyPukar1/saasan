import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { GlobalHttpException } from 'src/common/exceptions/global-http.exception';
import { ProvinceRepository } from '../repositories/province.repository';
import { CreateProvinceDto } from '../dtos/create-province.dto';
import { ResponseHelper } from 'src/common/helpers/response.helper';
import { ProvinceSerializer } from '../serializers/province.serializer';
import { ProvinceIdDto } from '../dtos/province-id.dto';
import { MemoryCacheService } from 'src/common/cache/memory-cache.service';

@Injectable()
export class ProvinceService {
  private readonly logger = new Logger(ProvinceService.name);

  constructor(
    private readonly provinceRepo: ProvinceRepository, 
    private readonly memoryCache: MemoryCacheService,
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
    
    this.memoryCache.delete("location:provinces");
  }

  async getProvinces({ page, limit }) {
    const cacheKey = `location:provinces:${page}:${limit}`;

    const cached = this.memoryCache.get(cacheKey);
    if (cached) {
      this.logger.log(`Cache hit for ${cacheKey}`);
      return ResponseHelper.response(
        ProvinceSerializer,
        cached,
        'Provinces fetched successfully',
      );
    }
    
    const data = await this.provinceRepo.find({ page, limit });

    this.memoryCache.set(cacheKey, data, 300);
    
    return ResponseHelper.response(
      ProvinceSerializer,
      data,
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
