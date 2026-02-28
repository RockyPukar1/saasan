import { Controller, Delete, Get, Post, UseGuards } from '@nestjs/common';
import { HttpAccessTokenGuard } from 'src/common/guards/http-access-token.guard';
import { RequirePermissions } from 'src/rbac/decorators/permissions.decorator';
import { RbacGuard } from 'src/rbac/guards/rbac.guard';

@UseGuards(HttpAccessTokenGuard, RbacGuard)
@Controller('admin/users')
export class AdminUserController {
  @Get()
  @RequirePermissions('users:read')
  async getUsers() {}

  @Post()
  @RequirePermissions('users:create')
  async createUser() {}

  @Get(':userId')
  @RequirePermissions('users:update')
  async updateUser() {}

  @Delete(':userId')
  @RequirePermissions('users:delete')
  async deleteUser() {}
}
