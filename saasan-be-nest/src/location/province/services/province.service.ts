import { HttpStatus, Injectable } from '@nestjs/common';
import { GlobalHttpException } from 'src/common/exceptions/global-http.exception';
import { ProvinceRepository } from '../repositories/province.repository';
import { CreateProvinceDto } from '../dtos/create-province.dto';
import { ResponseHelper } from 'src/common/helpers/response.helper';
import { ProvinceSerializer } from '../serializers/province.serializer';
import { ProvinceIdDto } from '../dtos/province-id.dto';

@Injectable()
export class ProvinceService {
  constructor(private readonly provinceRepo: ProvinceRepository) {}

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

    this.provinceRepo.create(provinceData);
  }

  async getProvinces({ page, limit }) {
    const data = await this.provinceRepo.find({ page, limit });
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
