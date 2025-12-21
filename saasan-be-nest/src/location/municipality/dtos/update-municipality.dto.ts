import { IsMongoId, IsString } from 'class-validator';

export class UpdateMunicipalityDto {
  @IsString()
  name: string;

  @IsMongoId()
  provinceId: string;

  @IsMongoId()
  districtId: string;
}
