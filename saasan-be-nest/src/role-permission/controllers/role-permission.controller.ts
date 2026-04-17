import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { Roles } from 'src/common/decorators/roles.decorator';
import { HttpAccessTokenGuard } from 'src/common/guards/http-access-token.guard';
import { PermissionGuard } from 'src/common/guards/permission.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { UserRole } from 'src/user/entities/user.entity';
import { RolePermissionService } from '../services/role-permission.service';
import { PERMISSIONS } from 'src/common/constants/permission.constants';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { UpdateRolePermissionDto } from '../../auth/dtos/update-role-permission.dto';

@UseGuards(HttpAccessTokenGuard, RoleGuard, PermissionGuard)
@Roles(UserRole.ADMIN)
@Controller('role-permissions')
export class RolePermissionController {
  constructor(private readonly rolePermissionService: RolePermissionService) {}

  @Permissions(PERMISSIONS.roles.view)
  @Get()
  async getAllRolePermissions() {
    return await this.rolePermissionService.getAllRolePermission();
  }

  @Permissions(PERMISSIONS.roles.view)
  @Get(':role')
  async getRolePermissions(@Param('role') role: UserRole) {
    return await this.rolePermissionService.getPermissionsByRole(role);
  }

  @Permissions(PERMISSIONS.roles.updatePermissions)
  @Put(':role')
  async updateRolePermissions(
    @Param('role') role: UserRole,
    @Body() updateRolePermissionDto: UpdateRolePermissionDto,
  ) {
    return await this.rolePermissionService.updateRolePermissions(
      role,
      updateRolePermissionDto,
    );
  }
}
