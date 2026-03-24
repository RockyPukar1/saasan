import { IsMongoId, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsMongoId()
  provinceId?: string;

  @IsOptional()
  @IsMongoId()
  districtId?: string;

  @IsOptional()
  @IsMongoId()
  constituencyId?: string;

  @IsOptional()
  @IsMongoId()
  municipalityId?: string;

  @IsOptional()
  @IsMongoId()
  wardId?: string;
}
