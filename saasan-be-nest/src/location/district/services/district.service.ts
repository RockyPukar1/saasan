import { HttpStatus, Injectable } from '@nestjs/common';
import { GlobalHttpException } from 'src/common/exceptions/global-http.exception';
import { DistrictRepository } from '../repositories/district.repository';
import { CreateDistrictDto } from '../dtos/create-district.dto';

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

  private doesDistrictExists(filter: any) {
    return this.districtRepo.findOne(filter);
  }
}
