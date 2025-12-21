import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateMunicipalityDto } from '../dtos/create-municipality.dto';
import { MunicipalityRepository } from '../repositories/municipality.repository';
import { GlobalHttpException } from 'src/common/exceptions/global-http.exception';

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

  private doesMunicipalityExists(filter: any) {
    return this.municipalityRepo.findOne(filter);
  }
}
