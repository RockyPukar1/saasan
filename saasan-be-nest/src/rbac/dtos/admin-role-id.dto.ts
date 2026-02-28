import { IsMongoId } from 'class-validator';

export class AdminRoleIdDto {
  @IsMongoId()
  adminRoleId: string;
}
