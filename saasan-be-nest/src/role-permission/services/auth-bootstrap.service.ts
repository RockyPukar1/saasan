import { Injectable, OnModuleInit } from '@nestjs/common';
import { RolePermissionService } from './role-permission.service';

@Injectable()
export class RolePermissionBootstrapService implements OnModuleInit {
  constructor(private readonly rolePermissionService: RolePermissionService) {}

  async onModuleInit() {
    await this.rolePermissionService.seedDefaults();
  }
}
