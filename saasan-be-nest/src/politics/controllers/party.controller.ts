import { Controller, Get } from '@nestjs/common';
import { PartyService } from '../services/party.service';

@Controller('party')
export class PartyController {
  constructor(private readonly partyService: PartyService) {}

  @Get()
  async getParties() {
    return await this.partyService.getParties();
  }
}
