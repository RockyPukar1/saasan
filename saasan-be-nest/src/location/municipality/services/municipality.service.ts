import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateMunicipalityDto } from '../dtos/create-municipality.dto';
import { MunicipalityRepository } from '../repositories/municipality.repository';
import { GlobalHttpException } from 'src/common/exceptions/global-http.exception';
import { DistrictIdDto } from 'src/location/district/dtos/district-id.dto';
import { ResponseHelper } from 'src/common/helpers/response.helper';
import { MunicipalitySerializer } from '../serializers/municipality.serializer';

@Injectable()
export class MunicipalityService {
  constructor(private readonly municipalityRepo: MunicipalityRepository) {}

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

  async getAllMunicipalitiesByDistrictId(data: DistrictIdDto) {
    const municipalities = await this.municipalityRepo.findByDistrictId(data);
    return ResponseHelper.response(MunicipalitySerializer, municipalities, "Municipalities fetched successfully");
  }

  private doesMunicipalityExists(filter: any) {
    return this.municipalityRepo.findOne(filter);
  }
}
