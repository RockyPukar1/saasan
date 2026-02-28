import { HttpStatus, Injectable } from '@nestjs/common';
import { PermissionRepository } from '../repositories/permission.repository';
import { RoleRepository } from '../repositories/role.repository';
import { RoleIdDto } from '../dtos/role-id.dto';
import { PermissionIdDto } from '../dtos/permission-id.dto';
import { GlobalHttpException } from 'src/common/exceptions/global-http.exception';
import { ResponseHelper } from 'src/common/helpers/response.helper';
import { CreatePermissionDto } from '../dtos/create-permission.dto';
import { PermissionSerializer } from '../serializers/permission.serializer';
import { UpdatePermissionDto } from '../dtos/update-permission.dto';

@Injectable()
export class PermissionService {
  constructor(
    private readonly roleRepo: RoleRepository,
    private readonly permissionRepo: PermissionRepository,
  ) {}

  async createPermission(createPermissionDto: CreatePermissionDto) {
    const permission = await this.permissionRepo.create(createPermissionDto);
    return ResponseHelper.response(
      PermissionSerializer,
      permission,
      'Permission created successfully',
    );
  }

  async getPermissions() {
    const permissions = await this.permissionRepo.findAll();
    return ResponseHelper.response(
      PermissionSerializer,
      permissions,
      'Permissions fetched successfully',
    );
  }

  async getPermissionById(permissionIdDto: PermissionIdDto) {
    const permission = await this.permissionRepo.findById(permissionIdDto);
    if (!permission)
      throw new GlobalHttpException('permission404', HttpStatus.NOT_FOUND);

    return ResponseHelper.response(
      PermissionSerializer,
      permission,
      'Permission fetched successfully',
    );
  }

  async updatePermission(
    permissionIdDto: PermissionIdDto,
    updatePermissionDto: UpdatePermissionDto,
  ) {
    await this.permissionRepo.update(permissionIdDto, updatePermissionDto);
  }

  async deletePermission(permissionIdDto: PermissionIdDto) {
    // Check if any roles are using this permission
    const rolesUsingPermission =
      await this.roleRepo.findByPermissionId(permissionIdDto);
    if (rolesUsingPermission && rolesUsingPermission.length > 0)
      throw new GlobalHttpException('permissionInUse', HttpStatus.BAD_REQUEST);

    await this.permissionRepo.delete(permissionIdDto);
  }

  async getRolePermissions(roleIdDto: RoleIdDto) {
    const role = await this.roleRepo.findById(roleIdDto);
    if (!role) throw new GlobalHttpException('role404', HttpStatus.NOT_FOUND);

    const permissions = await this.roleRepo.findByRoleIds({
      roleIds: [role._id.toString()],
    });
    return ResponseHelper.response(
      PermissionSerializer,
      permissions,
      'Role permissions fetched successfully',
    );
  }
}
