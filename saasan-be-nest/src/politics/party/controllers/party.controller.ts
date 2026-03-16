import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { PartyService } from '../services/party.service';
import { CreatePartyDto, UpdatePartyDto } from '../serializers/party.dto';

@Controller('party')
export class PartyController {
  constructor(private readonly partyService: PartyService) {}

  @Get()
  async getParties() {
    return await this.partyService.getParties();
  }

  @Get(':id')
  async getPartyById(@Param('id') id: string) {
    try {
      return await this.partyService.getPartyById(id);
    } catch (error) {
      throw new HttpException('Party not found', HttpStatus.NOT_FOUND);
    }
  }

  @Post()
  async createParty(@Body() createPartyDto: CreatePartyDto) {
    try {
      return await this.partyService.createParty(createPartyDto);
    } catch (error) {
      throw new HttpException('Failed to create party', HttpStatus.BAD_REQUEST);
    }
  }

  @Put(':id')
  async updateParty(
    @Param('id') id: string,
    @Body() updatePartyDto: UpdatePartyDto,
  ) {
    try {
      return await this.partyService.updateParty(id, updatePartyDto);
    } catch (error) {
      throw new HttpException('Failed to update party', HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  async deleteParty(@Param('id') id: string) {
    try {
      await this.partyService.deleteParty(id);
      return { message: 'Party deleted successfully' };
    } catch (error) {
      throw new HttpException('Failed to delete party', HttpStatus.BAD_REQUEST);
    }
  }
}
