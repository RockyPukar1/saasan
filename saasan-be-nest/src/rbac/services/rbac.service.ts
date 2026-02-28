import { HttpStatus, Injectable } from '@nestjs/common';
import { PermissionRepository } from '../repositories/permission.repository';
import { RoleRepository } from '../repositories/role.repository';
import { UserRepository } from 'src/user/repositories/user.repository';
import { UserIdDto } from 'src/user/dtos/user-id.dto';
import { AdminRole } from '../entities/role.entity';
import { RoleIdDto } from '../dtos/role-id.dto';
import { PermissionIdDto } from '../dtos/permission-id.dto';
import { GlobalHttpException } from 'src/common/exceptions/global-http.exception';
import { Types } from 'mongoose';

@Injectable()
export class RbacService {
  constructor(
    private readonly roleRepo: RoleRepository,
    private readonly permissionRepo: PermissionRepository,
    private readonly userRepo: UserRepository,
  ) {}

  async getUserPermissions(userIdDto: UserIdDto) {
    const user = await this.userRepo.findOne(userIdDto);
    if (!user || !user.adminRoleId) {
      return [];
    }

    const role = await this.roleRepo.findById({
      roleId: user.adminRoleId.toString(),
    });
    if (!role || !role.isActive) {
      return [];
    }

    const permissions = await this.roleRepo.findByRoleIds({
      roleIds: [role._id.toString()],
    });

    return permissions.map((p) => `${p.resource}:${p.action}`);
  }

  async hasPermission(userIdDto: UserIdDto, resource: string, action: string) {
    const user = await this.userRepo.findById(userIdDto);
    if (!user || !user.adminRoleId) {
      return false;
    }

    const role = await this.roleRepo.findById({
      roleId: user.adminRoleId.toString(),
    });
    if (!role || !role.isActive) {
      return false;
    }

    if (role.adminRole === AdminRole.SUPER_ADMIN) {
      return true;
    }

    const permissions = await this.roleRepo.findByRoleIds({
      roleIds: [role._id.toString()],
    });
    return permissions.some(
      (p) => p.resource === resource && p.action === action,
    );
  }

  async assignPermissionToRole(
    roleIdDto: RoleIdDto,
    permissionIdDto: PermissionIdDto,
  ) {
    const role = await this.roleRepo.findById(roleIdDto);
    if (!role) throw new GlobalHttpException('role404', HttpStatus.NOT_FOUND);

    const permission = await this.permissionRepo.findById(permissionIdDto);
    if (!permission)
      throw new GlobalHttpException('permission404', HttpStatus.NOT_FOUND);

    if (
      !role.permissions.includes(
        new Types.ObjectId(permissionIdDto.permissionId),
      )
    ) {
      role.permissions.push(new Types.ObjectId(permissionIdDto.permissionId));
      await this.roleRepo.update(roleIdDto, {
        permissions: role.permissions.map(String),
      });
    }
  }

  async removePermissionFromRole(
    roleIdDto: RoleIdDto,
    permissionIdDto: PermissionIdDto,
  ) {
    const role = await this.roleRepo.findById(roleIdDto);
    if (!role) throw new GlobalHttpException('role404', HttpStatus.NOT_FOUND);

    role.permissions = role.permissions.filter(
      (p) => p.toString() !== permissionIdDto.permissionId,
    );
    await this.roleRepo.update(roleIdDto, {
      permissions: role.permissions.map(String),
    });
  }
}
