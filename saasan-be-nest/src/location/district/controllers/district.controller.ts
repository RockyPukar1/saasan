import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common';
import { HttpAccessTokenGuard } from 'src/common/guards/http-access-token.guard';
import { CreateDistrictDto } from '../dtos/create-district.dto';
import { DistrictService } from '../services/district.service';

@UseGuards(HttpAccessTokenGuard)
@Controller('district')
export class DistrictController {
  constructor(private readonly districtService: DistrictService) {}

  @Get()
  async getDistricts() {}

  @Get('districtId')
  async getDistrictById() {}

  @HttpCode(201)
  @Post()
  async createDistrict(@Body() districtData: CreateDistrictDto) {
    return this.districtService.createDistrict(districtData);
  }

  @Get(':districtId/constituency')
  async getConstituenciesByDistrict() {}

  @Get(':districtId/municipality')
  async getMunicipalitiesByDistrict() {}

  @Get(':districtId/ward')
  async getWardsByDistrict() {}
}
