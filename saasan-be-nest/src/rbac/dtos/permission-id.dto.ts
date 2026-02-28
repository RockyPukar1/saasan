import { IsMongoId } from 'class-validator';

export class PermissionIdDto {
  @IsMongoId()
  permissionId: string;
}
