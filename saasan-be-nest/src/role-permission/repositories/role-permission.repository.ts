import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  RolePermissionDocument,
  RolePermissionEntity,
} from '../entities/role-permission.entity';
import { Model } from 'mongoose';
import { UserRole } from 'src/user/entities/user.entity';

@Injectable()
export class RolePermissionRepository {
  constructor(
    @InjectModel(RolePermissionEntity.name)
    private readonly model: Model<RolePermissionDocument>,
  ) {}

  async findAll() {
    return await this.model.find().sort({ role: 1 });
  }

  async findByRole(role: UserRole) {
    return await this.model.findOne({ role });
  }

  async upsertRolePermissions(role: UserRole, permissions: string[]) {
    return await this.model.findOneAndUpdate(
      {
        role,
      },
      {
        $set: {
          role,
          permissions,
        },
      },
      {
        upsert: true,
        new: true,
      },
    );
  }
}
