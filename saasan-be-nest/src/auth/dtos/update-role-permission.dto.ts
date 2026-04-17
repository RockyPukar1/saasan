import { IsArray, IsString } from 'class-validator';

export class UpdateRolePermissionDto {
  @IsArray()
  @IsString({ each: true })
  permissions: string[];
}
