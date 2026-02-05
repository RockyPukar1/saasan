import {
  Controller,
  Get,
  Param,
} from '@nestjs/common';
import { DistrictService } from '../services/district.service';
import { ProvinceIdDto } from 'src/location/province/dtos/province-id.dto';

@Controller('district')
export class DistrictController {
  constructor(private readonly districtService: DistrictService) {}

  @Get('province/:provinceId')
  async getDistrictsByProvinceId(
    @Param() data: ProvinceIdDto
  ) {
    return await this.districtService.getAllDistrictsByProvinceId(data)
  }

  @Get(':districtId')
  async getDistrictById() {}

  @Get(':districtId/constituency')
  async getConstituenciesByDistrict() {}

  @Get(':districtId/municipality')
  async getMunicipalitiesByDistrict() {}

  @Get(':districtId/ward')
  async getWardsByDistrict() {}
}
