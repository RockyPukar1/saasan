import { Controller, Get, Param, Query } from '@nestjs/common';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { WardService } from '../services/ward.service';
import { MunicipalityIdDto } from 'src/location/municipality/dtos/municipality-id.dto';
import { WardIdDto } from '../dtos/ward-id.dto';
import { ProvinceIdDto } from 'src/location/province/dtos/province-id.dto';
import { DistrictIdDto } from 'src/location/district/dtos/district-id.dto';
@Controller('ward')
export class WardController {
  constructor(private readonly wardService: WardService) {}

  @Get()
  async getWards(@Query() paginationQuery: PaginationQueryDto) {
    return await this.wardService.getWards(paginationQuery);
  }

  @Get('province/:provinceId')
  async getWardsByProvinceId(
    @Param() provinceIdDto: ProvinceIdDto,
    @Query() paginationQuery: PaginationQueryDto,
  ) {
    return await this.wardService.getWardsByProvinceId(
      provinceIdDto,
      paginationQuery,
    );
  }

  @Get('district/:districtId')
  async getWardsByDistrictId(
    @Param() districtIdDto: DistrictIdDto,
    @Query() paginationQuery: PaginationQueryDto,
  ) {
    return await this.wardService.getWardsByDistrictId(
      districtIdDto,
      paginationQuery,
    );
  }

  @Get('municipality/:municipalityId')
  async getWardsByMunicipalityId(
    @Param() municipalityIdDto: MunicipalityIdDto,
    @Query() paginationQuery: PaginationQueryDto,
  ) {
    return await this.wardService.getWardsByMunicipalityId(
      municipalityIdDto,
      paginationQuery,
    );
  }

  @Get(':wardId')
  async getWardById(@Param() wardIdDto: WardIdDto) {
    return await this.wardService.getWardById(wardIdDto);
  }
}
