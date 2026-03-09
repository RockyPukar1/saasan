import { HttpStatus, Injectable } from '@nestjs/common';
import { ConstituencyRepository } from '../repositories/constituency.repository';
import { CreateConstituencyDto } from '../dtos/create-constituency.dto';
import { GlobalHttpException } from '@/common/exceptions/global-http.exception';
import { WardIdDto } from '@/location/ward/dtos/ward-id.dto';
import { ResponseHelper } from '@/common/helpers/response.helper';
import { WardRepository } from '@/location/ward/repositories/ward.repository';
import { ConstituencySerializer } from '../serializers/constituency.serializer';
import { ConstituencyIdDto } from '../dtos/constituency-id.dto';
import { ProvinceIdDto } from '@/location/province/dtos/province-id.dto';
import { DistrictIdDto } from '@/location/district/dtos/district-id.dto';

@Injectable()
export class ConstituencyService {
  constructor(
    private readonly constituencyRepo: ConstituencyRepository,
    private readonly wardRepo: WardRepository,
  ) {}

  async createConstituency(constituencyData: CreateConstituencyDto) {
    const doesConstituencyExists =
      await this.doesConstituencyExists(constituencyData).lean();
    if (doesConstituencyExists) {
      throw new GlobalHttpException(
        'constituencyAlreadyExistsWithDistrictAndConstituencyNumber',
        HttpStatus.AMBIGUOUS,
      );
    }

    this.constituencyRepo.create(constituencyData);
  }

  async getConstituencies({ page = 1, limit = 10 }) {
    const data = await this.constituencyRepo.find({ page, limit });
    return ResponseHelper.response(
      ConstituencySerializer,
      data,
      'Constituencies fetched successfully',
    );
  }

  async getConstituencyById(constituencyIdDto: ConstituencyIdDto) {
    const constituency = await this.constituencyRepo.findById(
      constituencyIdDto.constituencyId,
    );
    if (!constituency) {
      throw new GlobalHttpException('constituency404', HttpStatus.NOT_FOUND);
    }
    return ResponseHelper.response(
      ConstituencySerializer,
      constituency,
      'Constituency fetched successfully',
    );
  }

  async getConstituenciesByProvinceId(
    provinceIdDto: ProvinceIdDto,
    { page, limit },
  ) {
    const data = await this.constituencyRepo.findByProvinceId(provinceIdDto, {
      page,
      limit,
    });
    return ResponseHelper.response(
      ConstituencySerializer,
      data,
      'Constituencies fetched successfully',
    );
  }

  async getConstituenciesByDistrictId(
    districtIdDto: DistrictIdDto,
    { page, limit },
  ) {
    const data = await this.constituencyRepo.findByDistrictId(districtIdDto, {
      page,
      limit,
    });
    return ResponseHelper.response(
      ConstituencySerializer,
      data,
      'Constituencies fetched successfully',
    );
  }

  async getConstituencyByWardId({ wardId }: WardIdDto) {
    const ward = await this.wardRepo.findById(wardId);
    if (!ward) {
      throw new GlobalHttpException('ward404', HttpStatus.NOT_FOUND);
    }
    const constituency = await this.constituencyRepo.findById(
      ward.constituencyId.toString(),
    );
    return ResponseHelper.response(
      ConstituencySerializer,
      constituency,
      'Constituency fetched successfully',
    );
  }

  private doesConstituencyExists(filter: any) {
    return this.constituencyRepo.findOne(filter);
  }
}
