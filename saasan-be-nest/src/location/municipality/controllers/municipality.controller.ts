import { Controller, Get, Param, Query } from '@nestjs/common';
import { MunicipalityService } from '../services/municipality.service';
import { DistrictIdDto } from 'src/location/district/dtos/district-id.dto';
import { MunicipalityIdDto } from '../dtos/municipality-id.dto';
import { ProvinceIdDto } from 'src/location/province/dtos/province-id.dto';

@Controller('municipality')
export class MunicipalityController {
  constructor(private readonly municipalityService: MunicipalityService) {}

  @Get()
  async getMunicipalities(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return await this.municipalityService.getMunicipalities({ page, limit });
  }

  @Get('province/:provinceId')
  async getDistrictsByProvinceId(
    @Param() provinceIdDto: ProvinceIdDto,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return await this.municipalityService.getMunicipalitiesByProvinceId(
      provinceIdDto,
      {
        page,
        limit,
      },
    );
  }

  @Get('district/:districtId')
  async getMunicipalitiesByDistrictId(
    @Param() districtIdDto: DistrictIdDto,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return await this.municipalityService.getMunicipalitiesByDistrictId(
      districtIdDto,
      { page, limit },
    );
  }

  @Get(':municipalityId')
  async getMunicipalityById(@Param() municipalityIdDto: MunicipalityIdDto) {
    return await this.municipalityService.getMunicipalityById(
      municipalityIdDto,
    );
  }
}
