import { Controller, Get, Param, Query } from '@nestjs/common';
import { DistrictService } from '../services/district.service';
import { ProvinceIdDto } from 'src/location/province/dtos/province-id.dto';
import { DistrictIdDto } from '../dtos/district-id.dto';

@Controller('district')
export class DistrictController {
  constructor(private readonly districtService: DistrictService) {}

  @Get()
  async getDistricts(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return await this.districtService.getDistricts({ page, limit });
  }

  @Get('province/:provinceId')
  async getDistrictsByProvinceId(
    @Param() provinceIdDto: ProvinceIdDto,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return await this.districtService.getDistrictsByProvinceId(provinceIdDto, {
      page,
      limit,
    });
  }

  @Get(':districtId')
  async getDistrictById(@Param() districtIdDto: DistrictIdDto) {
    return await this.districtService.getDistrictById(districtIdDto);
  }
}
