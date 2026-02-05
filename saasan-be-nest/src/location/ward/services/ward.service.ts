import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateWardDto } from '../dtos/create-ward.dto';
import { WardRepository } from '../repositories/ward.repository';
import { GlobalHttpException } from 'src/common/exceptions/global-http.exception';
import { ResponseHelper } from 'src/common/helpers/response.helper';
import { MunicipalityIdDto } from 'src/location/municipality/dtos/municipality-id.dto';
import { WardSerializer } from '../serializers/ward.serializer';

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

  async getAllWardsByMunicipalityId(data: MunicipalityIdDto) {
    const wards = await this.wardRepo.findByMunicipalityId(data)
    return ResponseHelper.response(WardSerializer, wards, "Wards fetched successfully");
  }

  private doesWardExists(filter: any) {
    return this.wardRepo.findOne(filter);
  }
}
