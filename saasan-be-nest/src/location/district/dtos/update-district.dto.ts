import { IsMongoId, IsString } from 'class-validator';

export class UpdateDistrictDto {
  @IsString()
  name: string;

  @IsMongoId()
  provinceId: string;

  @IsString()
  headquarter: string;
}
