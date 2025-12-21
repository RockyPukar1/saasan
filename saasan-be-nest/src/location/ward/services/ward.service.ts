import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateWardDto } from '../dtos/create-ward.dto';
import { WardRepository } from '../repositories/ward.repository';
import { GlobalHttpException } from 'src/common/exceptions/global-http.exception';

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

  private doesWardExists(filter: any) {
    return this.wardRepo.findOne(filter);
  }
}
