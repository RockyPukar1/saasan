import { UserRole } from 'src/user/entities/user.entity';
import { DEFAULT_ROLE_PERMISSIONS } from '../constants/role-permission.constants';
import { permission } from 'process';

export class PermissionHelper {
  static getPermissionsByRole(role: UserRole): string[] {
    return DEFAULT_ROLE_PERMISSIONS[role] ?? [];
  }

  static hasAllPermissions(
    userPermissions: string[],
    requiredPermissions: string[],
  ): boolean {
    if (!requiredPermissions.length) return true;

    return requiredPermissions.every((permission) =>
      userPermissions.includes(permission),
    );
  }

  static toNestedPermissions(permissions: string[]) {
    const result: Record<string, any> = {};

    for (const permission of permissions) {
      const parts = permission.split('.');
      let current = result;

      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        const isLast = i === parts.length - 1;

        if (isLast) {
          current[part] = true;
        } else {
          if (!current[part] || typeof current[part] !== 'object') {
            current[part] = {};
          }
          current = current[part];
        }
      }
    }

    return result;
  }
}
