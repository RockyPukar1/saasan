import { HttpStatus, Injectable } from '@nestjs/common';
import { ConstituencyRepository } from '../repositories/constituency.repository';
import { CreateConstituencyDto } from '../dtos/create-constituency.dto';
import { GlobalHttpException } from 'src/common/exceptions/global-http.exception';

@Injectable()
export class ConstituencyService {
  constructor(private readonly constituencyRepo: ConstituencyRepository) {}

  async createConstituency(constituencyData: CreateConstituencyDto) {
    const doesConstituencyExists =
      await this.doesConstituencyExists(constituencyData).lean();
    if (doesConstituencyExists) {
      throw new GlobalHttpException(
        'constituencyAlreadyExistsWithDistrictAndConstituencyNumber',
        HttpStatus.AMBIGUOUS,
      );
    }

    this.constituencyRepo.create(constituencyData);
  }

  private doesConstituencyExists(filter: any) {
    return this.constituencyRepo.findOne(filter);
  }
}
