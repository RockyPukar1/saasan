import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateWardDto } from '../dtos/create-ward.dto';
import { WardRepository } from '../repositories/ward.repository';
import { GlobalHttpException } from 'src/common/exceptions/global-http.exception';
import { ResponseHelper } from 'src/common/helpers/response.helper';
import { MunicipalityIdDto } from 'src/location/municipality/dtos/municipality-id.dto';
import { WardIdDto } from '../dtos/ward-id.dto';
import { WardSerializer } from '../serializers/ward.serializer';
import { ProvinceIdDto } from 'src/location/province/dtos/province-id.dto';
import { DistrictIdDto } from 'src/location/district/dtos/district-id.dto';

@Injectable()
export class WardService {
  constructor(private readonly wardRepo: WardRepository) {}

  async createWard(wardData: CreateWardDto) {
    const doesWardExists = await this.doesWardExists({
      wardNumber: wardData.wardNumber,
      districtId: wardData.districtId,
    }).lean();
    if (doesWardExists) {
      throw new GlobalHttpException(
        'wardAlreadyExistsWithWardNumberAndWithMunicipality',
        HttpStatus.AMBIGUOUS,
      );
    }

    this.wardRepo.create(wardData);
  }

  async getWards({ page = 1, limit = 10 }) {
    const data = await this.wardRepo.find({ page, limit });
    return ResponseHelper.response(
      WardSerializer,
      data,
      'Wards fetched successfully',
    );
  }

  async getWardsByProvinceId(provinceIdDto: ProvinceIdDto, { page, limit }) {
    const data = await this.wardRepo.findByProvinceId(provinceIdDto, {
      page,
      limit,
    });
    return ResponseHelper.response(
      WardSerializer,
      data,
      'Wards fetched successfully',
    );
  }

  async getWardsByDistrictId(districtIdDto: DistrictIdDto, { page, limit }) {
    const data = await this.wardRepo.findByDistrictId(districtIdDto, {
      page,
      limit,
    });
    return ResponseHelper.response(
      WardSerializer,
      data,
      'Wards fetched successfully',
    );
  }

  async getWardsByMunicipalityId(
    municipalityIdDto: MunicipalityIdDto,
    { page, limit },
  ) {
    const data = await this.wardRepo.findByMunicipalityId(municipalityIdDto, {
      page,
      limit,
    });
    return ResponseHelper.response(
      WardSerializer,
      data,
      'Wards fetched successfully',
    );
  }

  async getWardById(wardIdDto: WardIdDto) {
    const ward = await this.wardRepo.findById(wardIdDto.wardId);
    if (!ward) {
      throw new GlobalHttpException('ward404', HttpStatus.NOT_FOUND);
    }
    return ResponseHelper.response(
      WardSerializer,
      ward,
      'Ward fetched successfully',
    );
  }

  private doesWardExists(filter: any) {
    return this.wardRepo.findOne(filter);
  }
}
