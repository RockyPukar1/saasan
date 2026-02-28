import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  PermissionEntity,
  PermissionEntitySchema,
} from './entities/permission.entity';
import { RoleEntity, RoleEntitySchema } from './entities/role.entity';
import { UserModule } from 'src/user/user.module';
import { PermisionController } from './controllers/permission.controller';
import { RoleController } from './controllers/role.controller';
import { PermissionRepository } from './repositories/permission.repository';
import { RoleRepository } from './repositories/role.repository';
import { RbacService } from './services/rbac.service';
import { PermissionService } from './services/permission.service';
import { RoleService } from './services/role.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PermissionEntity.name, schema: PermissionEntitySchema },
      { name: RoleEntity.name, schema: RoleEntitySchema },
    ]),
    UserModule,
  ],
  controllers: [PermisionController, RoleController],
  providers: [
    PermissionRepository,
    RoleRepository,
    RbacService,
    PermissionService,
    RoleService,
  ],
})
export class RbacModule {}
