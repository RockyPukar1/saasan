import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  PermissionEntity,
  PermissionEntityDocument,
} from '../entities/permission.entity';
import { Model, Types } from 'mongoose';
import { CreatePermissionDto } from '../dtos/create-permission.dto';
import { PermissionIdDto } from '../dtos/permission-id.dto';
import { UpdatePermissionDto } from '../dtos/update-permission.dto';
import { RoleIdsDto } from '../dtos/role-ids.dto';

@Injectable()
export class PermissionRepository {
  constructor(
    @InjectModel(PermissionEntity.name)
    private readonly model: Model<PermissionEntityDocument>,
  ) {}

  async create(createPermissionDto: CreatePermissionDto) {
    return await this.model.create(createPermissionDto);
  }

  async findById({ permissionId }: PermissionIdDto) {
    return await this.model.findById(permissionId);
  }

  async findAll() {
    return await this.model.find();
  }

  async update(
    { permissionId }: PermissionIdDto,
    updateData: UpdatePermissionDto,
  ) {
    return await this.model.findByIdAndUpdate(
      permissionId,
      { $set: updateData },
      { new: true },
    );
  }

  async delete({ permissionId }: PermissionIdDto) {
    return await this.model.findByIdAndDelete(permissionId);
  }
}
