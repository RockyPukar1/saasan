import { Injectable, NotFoundException } from '@nestjs/common';
import { PartyRepository } from '../repositories/party.repository';
import { ResponseHelper } from 'src/common/helpers/response.helper';
import { PartySerializer } from '../serializers/party.serializer';
import { CreatePartyDto, UpdatePartyDto } from '../serializers/party.dto';
import { PartyEntity } from '../entities/party.entity';

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

  async getPartyById(id: string) {
    const party = await this.partyRepo.getPartyById(id);
    if (!party) {
      throw new NotFoundException('Party not found');
    }
    return ResponseHelper.response(
      PartySerializer,
      party,
      'Party fetched successfully',
    );
  }

  async createParty(createPartyDto: CreatePartyDto) {
    const party = await this.partyRepo.createParty(createPartyDto);
    return ResponseHelper.response(
      PartySerializer,
      party,
      'Party created successfully',
    );
  }

  async updateParty(id: string, updatePartyDto: UpdatePartyDto) {
    const party = await this.partyRepo.updateParty(id, updatePartyDto);
    if (!party) {
      throw new NotFoundException('Party not found');
    }
    return ResponseHelper.response(
      PartySerializer,
      party,
      'Party updated successfully',
    );
  }

  async deleteParty(id: string) {
    // Check if party has associated politicians
    const politicians = await this.partyRepo.getPoliticiansByParty(id);
    if (politicians && politicians.length > 0) {
      throw new Error(
        'Cannot delete party with associated politicians. Please reassign or remove politicians first.',
      );
    }

    const result = await this.partyRepo.deleteParty(id);
    if (!result) {
      throw new NotFoundException('Party not found');
    }
    return { message: 'Party deleted successfully' };
  }
}
