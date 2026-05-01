import { Controller, Get, Param, Query } from '@nestjs/common';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { ProvinceService } from '../services/province.service';
import { ProvinceIdDto } from '../dtos/province-id.dto';

@Controller('province')
export class ProvinceController {
  constructor(private readonly provinceService: ProvinceService) {}

  @Get()
  async getProvinces(@Query() paginationQuery: PaginationQueryDto) {
    return await this.provinceService.getProvinces(paginationQuery);
  }

  @Get(':provinceId')
  async getProvinceById(@Param() provinceIdDto: ProvinceIdDto) {
    return await this.provinceService.getProvinceById(provinceIdDto);
  }
}
