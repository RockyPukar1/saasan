import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RolePermissionController } from './controllers/role-permission.controller';
import { RolePermissionService } from './services/role-permission.service';
import { RolePermissionRepository } from './repositories/role-permission.repository';
import {
  RolePermissionEntity,
  RolePermissionEntitySchema,
} from './entities/role-permission.entity';
import { RolePermissionBootstrapService } from './services/auth-bootstrap.service';
import { Global } from '@nestjs/common';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: RolePermissionEntity.name,
        schema: RolePermissionEntitySchema,
      },
    ]),
  ],
  controllers: [RolePermissionController],
  providers: [
    RolePermissionService,
    RolePermissionRepository,
    RolePermissionBootstrapService,
  ],
  exports: [RolePermissionService],
})
export class RolePermissionModule {}
