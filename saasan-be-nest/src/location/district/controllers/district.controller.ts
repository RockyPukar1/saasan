import { Controller, Get, Param, Query } from '@nestjs/common';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { DistrictService } from '../services/district.service';
import { ProvinceIdDto } from 'src/location/province/dtos/province-id.dto';
import { DistrictIdDto } from '../dtos/district-id.dto';

@Controller('district')
export class DistrictController {
  constructor(private readonly districtService: DistrictService) {}

  @Get()
  async getDistricts(@Query() paginationQuery: PaginationQueryDto) {
    return await this.districtService.getDistricts(paginationQuery);
  }

  @Get('province/:provinceId')
  async getDistrictsByProvinceId(
    @Param() provinceIdDto: ProvinceIdDto,
    @Query() paginationQuery: PaginationQueryDto,
  ) {
    return await this.districtService.getDistrictsByProvinceId(
      provinceIdDto,
      paginationQuery,
    );
  }

  @Get(':districtId')
  async getDistrictById(@Param() districtIdDto: DistrictIdDto) {
    return await this.districtService.getDistrictById(districtIdDto);
  }
}
