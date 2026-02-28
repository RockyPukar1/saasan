import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  AdminRole,
  RoleEntity,
  RoleEntityDocument,
} from '../entities/role.entity';
import { Model, Types } from 'mongoose';
import { CreateRoleDto } from '../dtos/create-role.dto';
import { RoleIdDto } from '../dtos/role-id.dto';
import { UpdateRoleDto } from '../dtos/update-role.dto';
import { PermissionIdDto } from '../dtos/permission-id.dto';
import { RoleIdsDto } from '../dtos/role-ids.dto';

@Injectable()
export class RoleRepository {
  constructor(
    @InjectModel(RoleEntity.name)
    private readonly model: Model<RoleEntityDocument>,
  ) {}

  async create(createRoleDto: CreateRoleDto) {
    return await this.model.create(createRoleDto);
  }

  async findById({ roleId }: RoleIdDto) {
    return await this.model.findById(roleId).populate('permissions');
  }

  async findAll() {
    return await this.model.find({ isActive: true }).populate('permissions');
  }

  async update({ roleId }: RoleIdDto, updateData: UpdateRoleDto) {
    return await this.model
      .findByIdAndUpdate(roleId, { $set: updateData }, { new: true })
      .populate('permissions');
  }

  async delete({ roleId }: RoleIdDto) {
    return await this.model.findByIdAndDelete(roleId);
  }

  async findByPermissionId({ permissionId }: PermissionIdDto) {
    return await this.model.find({
      permissions: new Types.ObjectId(permissionId),
    });
  }

  async findByAdminRole(adminRole: AdminRole) {
    return await this.model.findOne({ adminRole }).populate('permissions');
  }

  async findByRoleIds({ roleIds }: RoleIdsDto) {
    const roleObjectIds = roleIds.map((id) => new Types.ObjectId(id));
    return await this.model.aggregate([
      {
        $match: {
          _id: {
            $in: roleObjectIds,
          },
        },
      },
      {
        $lookup: {
          from: 'permissions',
          localField: 'permissions',
          foreignField: '_id',
          as: 'permissions',
        },
      },
    ]);
  }
}
