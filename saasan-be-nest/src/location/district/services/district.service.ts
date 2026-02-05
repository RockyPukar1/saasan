import { HttpStatus, Injectable } from '@nestjs/common';
import { GlobalHttpException } from 'src/common/exceptions/global-http.exception';
import { DistrictRepository } from '../repositories/district.repository';
import { CreateDistrictDto } from '../dtos/create-district.dto';
import { ProvinceIdDto } from 'src/location/province/dtos/province-id.dto';
import { ResponseHelper } from 'src/common/helpers/response.helper';
import { DistrictSerializer } from '../serializers/district.serializer';

@Injectable()
export class DistrictService {
  constructor(private readonly districtRepo: DistrictRepository) {}

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

    this.districtRepo.create(districtData);
  }

  async getAllDistrictsByProvinceId(data: ProvinceIdDto) {
    const districts = await this.districtRepo.findByProvinceId(data);
    return ResponseHelper.response(DistrictSerializer, districts, "Districts fetched successfully")
  }

  private doesDistrictExists(filter: any) {
    return this.districtRepo.findOne(filter);
  }
}
