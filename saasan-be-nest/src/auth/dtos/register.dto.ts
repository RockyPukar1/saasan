import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterUserDto {
  @IsEmail()
  email: string;

  @IsString()
  fullName: string;

  @IsString()
  @MinLength(8)
  password: string;
}
