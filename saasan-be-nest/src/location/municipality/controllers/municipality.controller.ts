import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common';
import { HttpAccessTokenGuard } from 'src/common/guards/http-access-token.guard';
import { MunicipalityService } from '../services/municipality.service';
import { CreateMunicipalityDto } from '../dtos/create-municipality.dto';

@UseGuards(HttpAccessTokenGuard)
@Controller('municipality')
export class MunicipalityController {
  constructor(private readonly municipalityService: MunicipalityService) {}
  @Get()
  async getMunicipalities() {}

  @Get('municipalityId')
  async getMunicipalityById() {}

  @HttpCode(201)
  @Post()
  async createMunicipality(@Body() municipalityData: CreateMunicipalityDto) {
    return this.municipalityService.createMunicipality(municipalityData);
  }

  @Get(':municipalityId/ward')
  async getWardsByMunicipality() {}
}
