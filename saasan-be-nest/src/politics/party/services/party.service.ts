import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PartyRepository } from '../repositories/party.repository';
import { ResponseHelper } from 'src/common/helpers/response.helper';
import { PartySerializer } from '../serializers/party.serializer';
import { CreatePartyDto, UpdatePartyDto } from '../serializers/party.dto';
import { RedisCacheService } from 'src/common/cache/services/redis-cache.service';

@Injectable()
export class PartyService {
  private readonly logger = new Logger(PartyService.name);

  constructor(
    private readonly partyRepo: PartyRepository,
    private readonly redisCache: RedisCacheService,
  ) {}

  async getParties() {
    const cacheKey = 'politics:parties';

    const cached = await this.redisCache.get(cacheKey);
    if (cached) {
      return ResponseHelper.response(
        PartySerializer,
        cached,
        'Parties fetched successfully',
      );
    }

    const parties = await this.partyRepo.getParties();

    await this.redisCache.set(cacheKey, parties);

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

    await this.redisCache.del('politics:parties');

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

    await this.redisCache.del('politics:parties');

    return { message: 'Party deleted successfully' };
  }
}
