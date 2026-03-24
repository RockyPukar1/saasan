import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateMunicipalityDto } from '../dtos/create-municipality.dto';
import { MunicipalityRepository } from '../repositories/municipality.repository';
import { GlobalHttpException } from 'src/common/exceptions/global-http.exception';
import { DistrictIdDto } from 'src/location/district/dtos/district-id.dto';
import { MunicipalityIdDto } from '../dtos/municipality-id.dto';
import { ResponseHelper } from 'src/common/helpers/response.helper';
import { MunicipalitySerializer } from '../serializers/municipality.serializer';
import { ProvinceIdDto } from 'src/location/province/dtos/province-id.dto';
import { Logger } from '@nestjs/common';
import { RedisCacheService } from 'src/common/cache/services/redis-cache.service';

@Injectable()
export class MunicipalityService {
  private readonly logger = new Logger(MunicipalityService.name);

  constructor(
    private readonly municipalityRepo: MunicipalityRepository,
    private readonly redisCache: RedisCacheService,
  ) {}

  async createMunicipality(municipalityData: CreateMunicipalityDto) {
    const doesMunicipalityExists = await this.doesMunicipalityExists({
      name: municipalityData.name,
      districtId: municipalityData.districtId,
      provinceId: municipalityData.provinceId,
    }).lean();
    if (doesMunicipalityExists) {
      throw new GlobalHttpException(
        'municipalityAlreadyExistsWithNameOrWithDistrict',
        HttpStatus.AMBIGUOUS,
      );
    }

    await this.municipalityRepo.create(municipalityData);

    await this.redisCache.del('location:municipalities');
  }

  async getMunicipalities({ page = 1, limit = 10 }) {
    const cacheKey = `location:municipalities:${page}:${limit}`;

    const cached = await this.redisCache.get(cacheKey);
    if (cached) {
      return ResponseHelper.response(
        MunicipalitySerializer,
        cached,
        'Municipalities fetched successfully',
      );
    }

    const data = await this.municipalityRepo.find({ page, limit });

    await this.redisCache.set(cacheKey, data);

    return ResponseHelper.response(
      MunicipalitySerializer,
      data,
      'Municipalities fetched successfully',
    );
  }

  async getMunicipalitiesByProvinceId(
    provinceIdDto: ProvinceIdDto,
    { page, limit },
  ) {
    const data = await this.municipalityRepo.findByProvinceId(provinceIdDto, {
      page,
      limit,
    });
    return ResponseHelper.response(
      MunicipalitySerializer,
      data,
      'Districts fetched successfully',
    );
  }

  async getMunicipalitiesByDistrictId(
    districtIdDto: DistrictIdDto,
    { page, limit },
  ) {
    const data = await this.municipalityRepo.findByDistrictId(districtIdDto, {
      page,
      limit,
    });
    return ResponseHelper.response(
      MunicipalitySerializer,
      data,
      'Municipalities fetched successfully',
    );
  }

  async getMunicipalityById(municipalityIdDto: MunicipalityIdDto) {
    const municipality = await this.municipalityRepo.findById(
      municipalityIdDto.municipalityId,
    );
    if (!municipality) {
      throw new GlobalHttpException('municipality404', HttpStatus.NOT_FOUND);
    }
    return ResponseHelper.response(
      MunicipalitySerializer,
      municipality,
      'Municipality fetched successfully',
    );
  }

  private doesMunicipalityExists(filter: any) {
    return this.municipalityRepo.findOne(filter);
  }
}
