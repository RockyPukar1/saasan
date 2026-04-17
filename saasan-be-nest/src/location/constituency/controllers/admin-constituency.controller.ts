import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ConstituencyService } from '../services/constituency.service';
import { HttpAccessTokenGuard } from 'src/common/guards/http-access-token.guard';
import { CreateConstituencyDto } from '../dtos/create-constituency.dto';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/user/entities/user.entity';

@UseGuards(HttpAccessTokenGuard, RoleGuard)
@Roles(UserRole.ADMIN)
@Controller('admin/constituency')
export class AdminConstituencyController {
  constructor(private readonly constituencyService: ConstituencyService) {}

  @HttpCode(201)
  @Post()
  async createConstituency(@Body() constituencyData: CreateConstituencyDto) {
    return this.constituencyService.createConstituency(constituencyData);
  }
}
