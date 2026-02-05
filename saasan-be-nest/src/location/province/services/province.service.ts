import { HttpStatus, Injectable } from '@nestjs/common';
import { GlobalHttpException } from 'src/common/exceptions/global-http.exception';
import { ProvinceRepository } from '../repositories/province.repository';
import { CreateProvinceDto } from '../dtos/create-province.dto';
import { ResponseHelper } from 'src/common/helpers/response.helper';
import { ProvinceSerializer } from '../serializers/province.serializer';

@Injectable()
export class ProvinceService {
  constructor(private readonly provinceRepo: ProvinceRepository) {}

  async createProvince(provinceData: CreateProvinceDto) {
    const doesProvinceExists = await this.doesProvinceExists({
      name: provinceData.name,
      provinceNumber: provinceData.provinceNumber,
    })
    if (doesProvinceExists) {
      throw new GlobalHttpException(
        'provinceAlreadyExistsWithNameOrProvinceNumber',
        HttpStatus.AMBIGUOUS,
      );
    }

    this.provinceRepo.create(provinceData);
  }

  async getAllProvinces() {
    const provinces = await this.provinceRepo.find();
    return ResponseHelper.response(ProvinceSerializer, provinces, "Provinces fetched successfully")
  }

  private doesProvinceExists(filter: any) {
    return this.provinceRepo.findOne(filter);
  }
}
