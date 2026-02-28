import { IsEnum, IsString } from 'class-validator';
import { PermissionAction } from '../entities/permission.entity';

export class CreatePermissionDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  resource: string;

  @IsEnum(PermissionAction)
  action: PermissionAction;

  @IsString()
  module: string;
}
