import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PartyRepository } from '../repositories/party.repository';
import { ResponseHelper } from 'src/common/helpers/response.helper';
import { PartySerializer } from '../serializers/party.serializer';
import { CreatePartyDto, UpdatePartyDto } from '../serializers/party.dto';
import { MemoryCacheService } from 'src/common/cache/memory-cache.service';

@Injectable()
export class PartyService {
  private readonly logger = new Logger(PartyService.name);
  
  constructor(
    private readonly partyRepo: PartyRepository,
    private readonly memoryCache: MemoryCacheService,
  ) {}

  async getParties() {
    const cacheKey = 'politics:parties';
    
    const cached = this.memoryCache.get(cacheKey);
    if (cached) {
      this.logger.log(`Cache hit for ${cacheKey}`);
      return ResponseHelper.response(
        PartySerializer,
        cached,
        'Parties fetched successfully',
      );
    }
    
    const parties = await this.partyRepo.getParties();
    this.memoryCache.set(cacheKey, parties, 7200);
    
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

    this.memoryCache.delete("politics:parties");
    
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

    this.memoryCache.delete("politics:parties");
    
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

    this.memoryCache.delete("politics:parties");
    
    return { message: 'Party deleted successfully' };
  }
}
