import { IsMongoId, IsString } from 'class-validator';

export class CreateDistrictDto {
  @IsString()
  name: string;

  @IsMongoId()
  provinceId: string;

  @IsString()
  headquarter: string;
}
