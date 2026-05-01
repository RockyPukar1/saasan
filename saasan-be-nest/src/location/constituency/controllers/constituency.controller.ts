import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { ConstituencyService } from '../services/constituency.service';
import { CreateConstituencyDto } from '../dtos/create-constituency.dto';
import { WardIdDto } from 'src/location/ward/dtos/ward-id.dto';
import { ConstituencyIdDto } from '../dtos/constituency-id.dto';
import { ProvinceIdDto } from 'src/location/province/dtos/province-id.dto';
import { DistrictIdDto } from 'src/location/district/dtos/district-id.dto';

@Controller('constituency')
export class ConstituencyController {
  constructor(private readonly constituencyService: ConstituencyService) {}
  @Get()
  async getConstituencies(@Query() paginationQuery: PaginationQueryDto) {
    return await this.constituencyService.getConstituencies(paginationQuery);
  }

  @HttpCode(201)
  @Post()
  async createConstituency(@Body() constituencyData: CreateConstituencyDto) {
    return this.constituencyService.createConstituency(constituencyData);
  }

  @Get(':constituencyId')
  async getConstituencyById(@Param() constituencyIdDto: ConstituencyIdDto) {
    return await this.constituencyService.getConstituencyById(
      constituencyIdDto,
    );
  }

  @Get('province/:provinceId')
  async getConstituenciesByProvinceId(
    @Param() provinceIdDto: ProvinceIdDto,
    @Query() paginationQuery: PaginationQueryDto,
  ) {
    return await this.constituencyService.getConstituenciesByProvinceId(
      provinceIdDto,
      paginationQuery,
    );
  }

  @Get('district/:districtId')
  async getConstituenciesByDistrictId(
    @Param() districtIdDto: DistrictIdDto,
    @Query() paginationQuery: PaginationQueryDto,
  ) {
    return await this.constituencyService.getConstituenciesByDistrictId(
      districtIdDto,
      paginationQuery,
    );
  }

  @Get('ward/:wardId')
  async getConstituencyByWardId(@Param() data: WardIdDto) {
    return await this.constituencyService.getConstituencyByWardId(data);
  }
}
