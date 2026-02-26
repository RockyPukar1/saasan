import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { HttpAccessTokenGuard } from 'src/common/guards/http-access-token.guard';
import { CreateDistrictDto } from '../dtos/create-district.dto';
import { DistrictService } from '../services/district.service';

@UseGuards(HttpAccessTokenGuard)
@Controller('admin/district')
export class AdminDistrictController {
  constructor(private readonly districtService: DistrictService) {}

  @HttpCode(201)
  @Post()
  async createDistrict(@Body() districtData: CreateDistrictDto) {
    return this.districtService.createDistrict(districtData);
  }
}
