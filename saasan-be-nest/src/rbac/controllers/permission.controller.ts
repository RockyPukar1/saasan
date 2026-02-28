import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { HttpAccessTokenGuard } from 'src/common/guards/http-access-token.guard';
import { RoleIdDto } from '../dtos/role-id.dto';
import { PermissionService } from '../services/permission.service';
import { PermissionIdDto } from '../dtos/permission-id.dto';
import { UpdatePermissionDto } from '../dtos/update-permission.dto';
import { CreatePermissionDto } from '../dtos/create-permission.dto';

@UseGuards(HttpAccessTokenGuard)
@Controller('rbac/permission')
export class PermisionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Get()
  async getPermissions() {
    return await this.permissionService.getPermissions();
  }

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createPermission(@Body() createPermissionDto: CreatePermissionDto) {
    return await this.permissionService.createPermission(createPermissionDto);
  }

  @Get(':permissionId')
  async getPermission(@Param() permissionIdDto: PermissionIdDto) {
    return await this.permissionService.getPermissionById(permissionIdDto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Put(':permissionId')
  async updatePermission(
    @Param() permissionIdDto: PermissionIdDto,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ) {
    return await this.permissionService.updatePermission(
      permissionIdDto,
      updatePermissionDto,
    );
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':permissionId')
  async deletePermission(@Param() permissionIdDto: PermissionIdDto) {
    await this.permissionService.deletePermission(permissionIdDto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Get(':roleId/permissions')
  async getRolePermissions(@Param() roleIdDto: RoleIdDto) {
    return await this.permissionService.getRolePermissions(roleIdDto);
  }
}
