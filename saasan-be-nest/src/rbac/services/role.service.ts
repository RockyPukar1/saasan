import { HttpStatus, Injectable } from '@nestjs/common';
import { RoleRepository } from '../repositories/role.repository';
import { UserRepository } from 'src/user/repositories/user.repository';
import { RoleIdDto } from '../dtos/role-id.dto';
import { GlobalHttpException } from 'src/common/exceptions/global-http.exception';
import { CreateRoleDto } from '../dtos/create-role.dto';
import { ResponseHelper } from 'src/common/helpers/response.helper';
import { RoleSerializer } from '../serializers/role.serializer';
import { UpdateRoleDto } from '../dtos/update-role.dto';

@Injectable()
export class RoleService {
  constructor(
    private readonly roleRepo: RoleRepository,
    private readonly userRepo: UserRepository,
  ) {}

  async createRole(createRoleDto: CreateRoleDto) {
    const role = await this.roleRepo.create(createRoleDto);
    return ResponseHelper.response(
      RoleSerializer,
      role,
      'Roles fetched successfully',
    );
  }

  async getAllRoles() {
    const roles = await this.roleRepo.findAll();
    return ResponseHelper.response(
      RoleSerializer,
      roles,
      'Roles fetched successfully',
    );
  }

  async getRoleById(roleIdDto: RoleIdDto) {
    const role = await this.roleRepo.findById(roleIdDto);
    if (!role) throw new GlobalHttpException('role404', HttpStatus.NOT_FOUND);

    return ResponseHelper.response(
      RoleSerializer,
      role,
      'Role fetched successfully',
    );
  }

  async updateRole(roleIdDto: RoleIdDto, updateRoleDto: UpdateRoleDto) {
    const role = await this.roleRepo.update(roleIdDto, updateRoleDto);
    return ResponseHelper.response(
      RoleSerializer,
      role,
      'Role updated successfully',
    );
  }

  async deleteRole(roleIdDto: RoleIdDto) {
    // Check if any users are using this role
    const usersUsingRole = await this.userRepo.findByAdminRoleId({
      adminRoleId: roleIdDto.roleId,
    });
    if (usersUsingRole && usersUsingRole.length > 0)
      throw new GlobalHttpException('roleInUse', HttpStatus.BAD_REQUEST);

    await this.roleRepo.delete(roleIdDto);
  }
}
