import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UserRole } from 'src/user/entities/user.entity';

@Schema({ timestamps: true, collection: RolePermissionEntity.collection })
export class RolePermissionEntity {
  static readonly collection = 'role_permissions';

  @Prop({
    type: String,
    enum: UserRole,
    required: true,
    unique: true,
    index: true,
  })
  role: UserRole;

  @Prop({
    type: [String],
    required: true,
    default: [],
  })
  permissions: string[];
}

export const RolePermissionEntitySchema =
  SchemaFactory.createForClass(RolePermissionEntity);
export type RolePermissionDocument = Document & RolePermissionEntity;
