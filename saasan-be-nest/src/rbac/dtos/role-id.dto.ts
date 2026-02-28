import { IsMongoId } from 'class-validator';

export class RoleIdDto {
  @IsMongoId()
  roleId: string;
}
