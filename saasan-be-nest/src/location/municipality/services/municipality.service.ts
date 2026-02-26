import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateMunicipalityDto } from '../dtos/create-municipality.dto';
import { MunicipalityRepository } from '../repositories/municipality.repository';
import { GlobalHttpException } from 'src/common/exceptions/global-http.exception';
import { DistrictIdDto } from 'src/location/district/dtos/district-id.dto';
import { MunicipalityIdDto } from '../dtos/municipality-id.dto';
import { ResponseHelper } from 'src/common/helpers/response.helper';
import { MunicipalitySerializer } from '../serializers/municipality.serializer';
import { WardRepository } from 'src/location/ward/repositories/ward.repository';
import { ProvinceIdDto } from 'src/location/province/dtos/province-id.dto';

@Injectable()
export class MunicipalityService {
  constructor(
    private readonly municipalityRepo: MunicipalityRepository,
    private readonly wardRepo: WardRepository,
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

    this.municipalityRepo.create(municipalityData);
  }

  async getMunicipalities({ page = 1, limit = 10 }) {
    const data = await this.municipalityRepo.find({ page, limit });
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
