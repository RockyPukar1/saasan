import { IsEmail, IsMongoId, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsEmail()
  @IsString()
  email: string;

  @IsString()
  fullName: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsMongoId()
  provinceId: string;

  @IsMongoId()
  districtId: string;

  @IsMongoId()
  municipalityId: string;

  @IsMongoId()
  wardId: string;

  @IsMongoId()
  constituencyId: string;
}
