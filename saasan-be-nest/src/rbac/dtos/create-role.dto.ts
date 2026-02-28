import { IsEnum, IsOptional, IsString } from 'class-validator';
import { AdminRole } from '../entities/role.entity';

export class CreateRoleDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsEnum(AdminRole)
  adminRole?: AdminRole;
}
