import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProvinceService } from '../services/province.service';
import { ProvinceIdDto } from '../dtos/province-id.dto';

@Controller('province')
export class ProvinceController {
  constructor(private readonly provinceService: ProvinceService) {}

  @Get()
  async getProvinces(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return await this.provinceService.getProvinces({ page, limit });
  }

  @Get(':provinceId')
  async getProvinceById(@Param() provinceIdDto: ProvinceIdDto) {
    return await this.provinceService.getProvinceById(provinceIdDto);
  }
}
