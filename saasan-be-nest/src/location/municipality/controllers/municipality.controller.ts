import { Controller, Get, Param, Query } from '@nestjs/common';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { MunicipalityService } from '../services/municipality.service';
import { DistrictIdDto } from 'src/location/district/dtos/district-id.dto';
import { MunicipalityIdDto } from '../dtos/municipality-id.dto';
import { ProvinceIdDto } from 'src/location/province/dtos/province-id.dto';

@Controller('municipality')
export class MunicipalityController {
  constructor(private readonly municipalityService: MunicipalityService) {}

  @Get()
  async getMunicipalities(@Query() paginationQuery: PaginationQueryDto) {
    return await this.municipalityService.getMunicipalities(paginationQuery);
  }

  @Get('province/:provinceId')
  async getDistrictsByProvinceId(
    @Param() provinceIdDto: ProvinceIdDto,
    @Query() paginationQuery: PaginationQueryDto,
  ) {
    return await this.municipalityService.getMunicipalitiesByProvinceId(
      provinceIdDto,
      paginationQuery,
    );
  }

  @Get('district/:districtId')
  async getMunicipalitiesByDistrictId(
    @Param() districtIdDto: DistrictIdDto,
    @Query() paginationQuery: PaginationQueryDto,
  ) {
    return await this.municipalityService.getMunicipalitiesByDistrictId(
      districtIdDto,
      paginationQuery,
    );
  }

  @Get(':municipalityId')
  async getMunicipalityById(@Param() municipalityIdDto: MunicipalityIdDto) {
    return await this.municipalityService.getMunicipalityById(
      municipalityIdDto,
    );
  }
}
