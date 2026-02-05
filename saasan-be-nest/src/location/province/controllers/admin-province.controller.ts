import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common';
import { HttpAccessTokenGuard } from 'src/common/guards/http-access-token.guard';
import { CreateProvinceDto } from '../dtos/create-province.dto';
import { ProvinceService } from '../services/province.service';

@UseGuards(HttpAccessTokenGuard)
@Controller('admin/province')
export class AdminProvinceController {
  constructor(private readonly provinceService: ProvinceService) {}
  @HttpCode(201)
  @Post()
  async createProvince(@Body() provinceData: CreateProvinceDto) {
    return this.provinceService.createProvince(provinceData);
  }
}
