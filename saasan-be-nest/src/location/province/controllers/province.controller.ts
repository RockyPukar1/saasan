import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common';
import { HttpAccessTokenGuard } from 'src/common/guards/http-access-token.guard';
import { CreateProvinceDto } from '../dtos/create-province.dto';
import { ProvinceService } from '../services/province.service';

@UseGuards(HttpAccessTokenGuard)
@Controller('province')
export class ProvinceController {
  constructor(private readonly provinceService: ProvinceService) {}

  @Get()
  async getProvinces() {}

  @Get('provinceId')
  async getProvinceById() {}

  @HttpCode(201)
  @Post()
  async createProvince(@Body() provinceData: CreateProvinceDto) {
    return this.provinceService.createProvince(provinceData);
  }

  @Get(':provinceId/district')
  async getDistrictsByProvince() {}

  @Get(':provinceId/constituency')
  async getConstituenciesByProvince() {}

  @Get(':provinceId/municipality')
  async getMunicipalitiesByProvince() {}

  @Get(':provinceId/ward')
  async getWardsByProvince() {}
}
