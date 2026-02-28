import { IsEnum, IsMongoId, IsOptional, IsString } from 'class-validator';
import { AdminRole } from '../entities/role.entity';

export class UpdateRoleDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(AdminRole)
  adminRole?: AdminRole;

  @IsOptional()
  @IsMongoId({ each: true })
  permissions?: string[];
}
