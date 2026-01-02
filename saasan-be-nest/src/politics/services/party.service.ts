import { Injectable } from '@nestjs/common';
import { PartyRepository } from '../repositories/party.repository';
import { ResponseHelper } from 'src/common/helpers/response.helper';
import { PartySerializer } from '../serializers/party.serializer';

@Injectable()
export class PartyService {
  constructor(private readonly partyRepo: PartyRepository) {}

  async getParties() {
    const parties = await this.partyRepo.getParties();
    return ResponseHelper.response(
      PartySerializer,
      parties,
      'Parties fetched successfully',
    );
  }
}
