import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { UserService } from '../services/user.services';
import { UserIdDto } from '../dtos/user-id.dto';
import { HttpAccessTokenGuard } from 'src/common/guards/http-access-token.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from '../entities/user.entity';
import { PermissionGuard } from 'src/common/guards/permission.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { PERMISSIONS } from 'src/common/constants/permission.constants';
import { UpdateUserDto } from '../dtos/update-user.dto';
import type { Request } from 'express';

@UseGuards(HttpAccessTokenGuard, RoleGuard, PermissionGuard)
@Roles(UserRole.ADMIN)
@Controller('admin/user')
export class AdminUserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  async getProfile(@Req() req: Request) {
    return await this.userService.getProfile({ userId: req.user.id });
  }

  @Put('profile')
  async updateProfile(@Req() req: Request, @Body() updateData: UpdateUserDto) {
    return this.userService.updateProfile({ userId: req.user.id }, updateData);
  }

  @Permissions(PERMISSIONS.users.view)
  @Get()
  async getAllUsers(@Query() paginationQuery: PaginationQueryDto) {
    return await this.userService.getAllUsers(paginationQuery);
  }

  @Permissions(PERMISSIONS.users.view)
  @Get(':userId')
  async getUserById(@Param() param: UserIdDto) {
    return this.userService.getUserById(param);
  }

  @Permissions(PERMISSIONS.users.update)
  @Put(':userId')
  async updateUser(
    @Param() param: UserIdDto,
    @Body() updateData: UpdateUserDto,
  ) {
    return this.userService.updateUser(param, updateData);
  }

  @Permissions(PERMISSIONS.users.delete)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':userId')
  async deleteUser(@Param() param: UserIdDto) {
    await this.userService.deleteUser(param);
  }
}
