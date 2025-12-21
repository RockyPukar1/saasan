import { HttpStatus, Injectable } from '@nestjs/common';
import { GlobalHttpException } from 'src/common/exceptions/global-http.exception';
import { ProvinceRepository } from '../repositories/province.repository';
import { CreateProvinceDto } from '../dtos/create-province.dto';

@Injectable()
export class ProvinceService {
  constructor(private readonly provinceRepo: ProvinceRepository) {}

  async createProvince(provinceData: CreateProvinceDto) {
    const doesProvinceExists = await this.doesProvinceExists({
      name: provinceData.name,
      provinceNumber: provinceData.provinceNumber,
    }).lean();
    if (doesProvinceExists) {
      throw new GlobalHttpException(
        'provinceAlreadyExistsWithNameOrProvinceNumber',
        HttpStatus.AMBIGUOUS,
      );
    }

    this.provinceRepo.create(provinceData);
  }

  private doesProvinceExists(filter: any) {
    return this.provinceRepo.findOne(filter);
  }
}
