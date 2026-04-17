import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '../services/user.services';
import { UserIdDto } from '../dtos/user-id.dto';
import { type Request } from 'express';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { HttpAccessTokenGuard } from 'src/common/guards/http-access-token.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/user/entities/user.entity';
import { PermissionGuard } from 'src/common/guards/permission.guard';

@UseGuards(HttpAccessTokenGuard, RoleGuard, PermissionGuard)
@Roles(UserRole.CITIZEN)
@Controller('citizen/user')
export class CitizenUserController {
  constructor(private readonly userService: UserService) {}

  // TODO: Change email
  // TODO: Change password

  @Get('profile')
  async getProfile(@Req() req: Request) {
    return await this.userService.getProfile({ userId: req.user.id });
  }

  @Put('profile')
  async updateProfile(@Req() req: Request, @Body() updateData: UpdateUserDto) {
    return this.userService.updateProfile({ userId: req.user.id }, updateData);
  }
}
