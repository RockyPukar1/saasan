import { IsMongoId } from 'class-validator';

export class RoleIdsDto {
  @IsMongoId({ each: true })
  roleIds: string[];
}
