import { IsEmail, IsMongoId, IsString, MinLength } from 'class-validator';

export class RegisterUserDto {
  @IsString()
  fullName: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsMongoId()
  provinceId: string;

  @IsMongoId()
  districtId: string;

  @IsMongoId()
  constituencyId: string;

  @IsMongoId()
  municipalityId: string;

  @IsMongoId()
  wardId: string;
}
