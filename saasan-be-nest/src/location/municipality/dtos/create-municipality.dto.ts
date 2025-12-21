import { IsMongoId, IsString } from 'class-validator';

export class CreateMunicipalityDto {
  @IsString()
  name: string;

  @IsMongoId()
  provinceId: string;

  @IsMongoId()
  districtId: string;
}
