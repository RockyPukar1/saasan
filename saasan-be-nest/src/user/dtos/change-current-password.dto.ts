import { IsString, MinLength } from 'class-validator';

export class ChangeCurrentPasswordDto {
  @IsString()
  currentPassword: string;

  @IsString()
  @MinLength(8)
  newPassword: string;
}
