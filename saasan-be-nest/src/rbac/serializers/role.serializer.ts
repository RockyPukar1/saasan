import { Expose, Transform } from 'class-transformer';
import { PermissionSerializer } from './permission.serializer';

export class RoleSerializer {
  @Expose() @Transform(({ obj }) => obj._id as string) id: string;
  @Expose() name: string;
  @Expose() description: string;
  @Expose() isActive: boolean;
  @Expose() adminRole?: string;
  @Expose()
  @Transform(({ obj }) => obj.permission)
  permissions?: PermissionSerializer[];
  @Expose() createdAt: string;
  @Expose() updatedAt: string;
}
