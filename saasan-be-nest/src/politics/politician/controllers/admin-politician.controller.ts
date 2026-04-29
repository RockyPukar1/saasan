import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PoliticianService } from '../services/politician.service';
import { PoliticianIdDto } from '../dtos/politician-id.dto';
import { HttpAccessTokenGuard } from 'src/common/guards/http-access-token.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/user/entities/user.entity';
import { RoleGuard } from 'src/common/guards/role.guard';
import { PermissionGuard } from 'src/common/guards/permission.guard';
import { PERMISSIONS } from 'src/common/constants/permission.constants';
import { Permissions } from 'src/common/decorators/permissions.decorator';

@UseGuards(HttpAccessTokenGuard, RoleGuard, PermissionGuard)
@Roles(UserRole.ADMIN)
@Controller('admin/politician')
export class AdminPoliticianController {
  constructor(private readonly politicianService: PoliticianService) {}

  @Permissions(PERMISSIONS.politicians.createAccount)
  @HttpCode(HttpStatus.CREATED)
  @Post(':politicianId/create-account')
  async createAccount(@Param() politicianIdDto: PoliticianIdDto) {
    return this.politicianService.createAccount(politicianIdDto);
  }
}
