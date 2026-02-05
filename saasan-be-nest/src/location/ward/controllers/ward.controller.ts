import {
  Controller,
  Get,
  Param,
} from '@nestjs/common';
import { WardService } from '../services/ward.service';
import { MunicipalityIdDto } from 'src/location/municipality/dtos/municipality-id.dto';

@Controller('ward')
export class WardController {
  constructor(private readonly wardService: WardService) {}

  @Get('municipality/:municipalityId')
  async getAllWardsByMunicipalityId(@Param() data: MunicipalityIdDto) {
    return await this.wardService.getAllWardsByMunicipalityId(data)
  }

  @Get('wardId')
  async getWardById() {}
}
