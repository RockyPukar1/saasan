import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common';
import { HttpAccessTokenGuard } from 'src/common/guards/http-access-token.guard';
import { WardService } from '../services/ward.service';
import { CreateWardDto } from '../dtos/create-ward.dto';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/user/entities/user.entity';

@UseGuards(HttpAccessTokenGuard, RoleGuard)
@Roles(UserRole.ADMIN)
@Controller('admin/ward')
export class AdminWardController {
  constructor(private readonly wardService: WardService) {}

  @HttpCode(201)
  @Post()
  async createWard(@Body() wardData: CreateWardDto) {
    return this.wardService.createWard(wardData);
  }
}
