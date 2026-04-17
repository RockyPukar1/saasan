import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { PermissionHelper } from '../helpers/permission.helper';
import { UserRole } from 'src/user/entities/user.entity';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { RolePermissionService } from 'src/role-permission/services/role-permission.service';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly rolePermissionService: RolePermissionService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredPermissions || requiredPermissions.length === 0) return true;

    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user;
    if (!user) throw new ForbiddenException('User context not found');

    const { permissions: userPermissions } =
      await this.rolePermissionService.getPermissionsByRole(
        user.role as UserRole,
      );
    if (
      !PermissionHelper.hasAllPermissions(userPermissions, requiredPermissions)
    )
      throw new ForbiddenException(
        'You do not have permission to access this resource',
      );

    request.user.permissions = userPermissions;
    return true;
  }
}
