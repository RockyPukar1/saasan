import { Body, Controller, Get, Put, Req, UseGuards } from '@nestjs/common';
import { UserService } from '../services/user.services';
import type { Request } from 'express';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { HttpAccessTokenGuard } from 'src/common/guards/http-access-token.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/user/entities/user.entity';
import { PermissionGuard } from 'src/common/guards/permission.guard';

@UseGuards(HttpAccessTokenGuard, RoleGuard, PermissionGuard)
@Roles(UserRole.POLITICIAN)
@Controller('politician/user')
export class PoliticianUserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  async getProfile(@Req() req: Request) {
    return await this.userService.getProfile({ userId: req.user.id });
  }

  @Put('profile')
  async updateProfile(@Req() req: Request, @Body() updateData: UpdateUserDto) {
    return this.userService.updateProfile({ userId: req.user.id }, updateData);
  }
}
