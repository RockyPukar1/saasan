import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { HttpAccessTokenGuard } from 'src/common/guards/http-access-token.guard';
import { RbacService } from '../services/rbac.service';
import { RoleIdDto } from '../dtos/role-id.dto';
import { CreateRoleDto } from '../dtos/create-role.dto';
import { UpdateRoleDto } from '../dtos/update-role.dto';
import { PermissionIdDto } from '../dtos/permission-id.dto';
import { RoleService } from '../services/role.service';

@UseGuards(HttpAccessTokenGuard)
@Controller('rbac/role')
export class RoleController {
  constructor(
    private readonly rbacService: RbacService,
    private readonly roleService: RoleService,
  ) {}

  @Get()
  async getRoles() {
    return await this.roleService.getAllRoles();
  }

  @Get(':roleId')
  async getRole(@Param() roleIdDto: RoleIdDto) {
    return await this.roleService.getRoleById(roleIdDto);
  }

  @Post()
  async createRole(@Body() createRoleDto: CreateRoleDto) {
    return await this.roleService.createRole(createRoleDto);
  }

  @Put(':roleId')
  async UpdateRoleDto(
    @Param() roleIdDto: RoleIdDto,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    return await this.roleService.updateRole(roleIdDto, updateRoleDto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Put(':roleId/permission/:permissionId')
  async assignPermission(
    @Param() roleIdDto: RoleIdDto,
    @Param() permissionIdDto: PermissionIdDto,
  ) {
    await this.rbacService.assignPermissionToRole(roleIdDto, permissionIdDto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Put(':roleId/permission/:permissionId')
  async removePermission(
    @Param() roleIdDto: RoleIdDto,
    @Param() permissionIdDto: PermissionIdDto,
  ) {
    await this.rbacService.removePermissionFromRole(roleIdDto, permissionIdDto);
  }
}
