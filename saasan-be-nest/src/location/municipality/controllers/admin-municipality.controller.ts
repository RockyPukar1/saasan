import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common';
import { HttpAccessTokenGuard } from 'src/common/guards/http-access-token.guard';
import { MunicipalityService } from '../services/municipality.service';
import { CreateMunicipalityDto } from '../dtos/create-municipality.dto';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/user/entities/user.entity';

@UseGuards(HttpAccessTokenGuard, RoleGuard)
@Roles(UserRole.ADMIN)
@Controller('admin/municipality')
export class AdminMunicipalityController {
  constructor(private readonly municipalityService: MunicipalityService) {}

  @HttpCode(201)
  @Post()
  async createMunicipality(@Body() municipalityData: CreateMunicipalityDto) {
    return this.municipalityService.createMunicipality(municipalityData);
  }
}
