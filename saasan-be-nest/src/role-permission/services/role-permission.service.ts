import { Injectable } from '@nestjs/common';
import { UserRole } from 'src/user/entities/user.entity';
import { RolePermissionRepository } from '../repositories/role-permission.repository';
import { DEFAULT_ROLE_PERMISSIONS } from 'src/common/constants/role-permission.constants';
import { RedisCacheService } from 'src/common/cache/services/redis-cache.service';
import { UpdateRolePermissionDto } from '../../auth/dtos/update-role-permission.dto';

@Injectable()
export class RolePermissionService {
  constructor(
    private readonly rolePermissionRepo: RolePermissionRepository,
    private readonly redisCache: RedisCacheService,
  ) {}

  private getCacheKey(role: UserRole) {
    return `role_permissions:${role}`;
  }

  async getPermissionsByRole(role: UserRole): Promise<{
    role: string;
    permissions: string[];
  }> {
    const cacheKey = this.getCacheKey(role);

    const cachedPermissions = await this.redisCache.get(cacheKey);

    if (cachedPermissions) {
      return { role, permissions: cachedPermissions as string[] };
    }

    const rolePermission = await this.rolePermissionRepo.findByRole(role);

    const permissions = rolePermission?.permissions?.length
      ? rolePermission.permissions
      : (DEFAULT_ROLE_PERMISSIONS[role] ?? []);

    await this.redisCache.set(cacheKey, permissions);

    return {
      role,
      permissions,
    };
  }

  async getAllRolePermission() {
    return await this.rolePermissionRepo.findAll();
  }

  async updateRolePermissions(
    role: UserRole,
    { permissions }: UpdateRolePermissionDto,
  ) {
    const uniquePermissions = [...new Set(permissions)];

    const updated = await this.rolePermissionRepo.upsertRolePermissions(
      role,
      uniquePermissions,
    );

    await this.redisCache.del(this.getCacheKey(role));

    return updated;
  }
  async seedDefaults() {
    for (const role of Object.values(UserRole)) {
      const existing = await this.rolePermissionRepo.findByRole(role);
      if (!existing) {
        await this.rolePermissionRepo.upsertRolePermissions(
          role,
          DEFAULT_ROLE_PERMISSIONS[role] ?? [],
        );
      } else {
        const mergedPermissions = [
          ...new Set([
            ...(existing.permissions || []),
            ...(DEFAULT_ROLE_PERMISSIONS[role] ?? []),
          ]),
        ];

        await this.rolePermissionRepo.upsertRolePermissions(
          role,
          mergedPermissions,
        );
      }

      await this.redisCache.del(this.getCacheKey(role));
    }
  }

  async clearRolePermisionCache(role: UserRole) {
    await this.redisCache.del(this.getCacheKey(role));
  }

  async warmRolePermissionCache(role: UserRole) {
    await this.getPermissionsByRole(role);
  }
}
