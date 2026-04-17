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
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/user/entities/user.entity';

@UseGuards(HttpAccessTokenGuard, RoleGuard)
@Roles(UserRole.ADMIN)
@Controller('admin/province')
export class AdminProvinceController {
  constructor(private readonly provinceService: ProvinceService) {}

  @HttpCode(201)
  @Post()
  async createProvince(@Body() provinceData: CreateProvinceDto) {
    return this.provinceService.createProvince(provinceData);
  }
}
