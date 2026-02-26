import { Controller, Get, Param, Query } from '@nestjs/common';
import { WardService } from '../services/ward.service';
import { MunicipalityIdDto } from 'src/location/municipality/dtos/municipality-id.dto';
import { WardIdDto } from '../dtos/ward-id.dto';
import { ProvinceIdDto } from 'src/location/province/dtos/province-id.dto';
import { DistrictIdDto } from 'src/location/district/dtos/district-id.dto';
@Controller('ward')
export class WardController {
  constructor(private readonly wardService: WardService) {}

  @Get()
  async getWards(@Query('page') page?: number, @Query('limit') limit?: number) {
    return await this.wardService.getWards({ page, limit });
  }

  @Get('province/:provinceId')
  async getWardsByProvinceId(
    @Param() provinceIdDto: ProvinceIdDto,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return await this.wardService.getWardsByProvinceId(provinceIdDto, {
      page,
      limit,
    });
  }

  @Get('district/:districtId')
  async getWardsByDistrictId(
    @Param() districtIdDto: DistrictIdDto,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return await this.wardService.getWardsByDistrictId(districtIdDto, {
      page,
      limit,
    });
  }

  @Get('municipality/:municipalityId')
  async getWardsByMunicipalityId(
    @Param() municipalityIdDto: MunicipalityIdDto,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return await this.wardService.getWardsByMunicipalityId(municipalityIdDto, {
      page,
      limit,
    });
  }

  @Get(':wardId')
  async getWardById(@Param() wardIdDto: WardIdDto) {
    return await this.wardService.getWardById(wardIdDto);
  }
}
