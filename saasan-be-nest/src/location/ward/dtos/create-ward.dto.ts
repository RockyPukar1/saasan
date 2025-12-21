import { IsMongoId, IsNumber, IsString } from 'class-validator';

export class CreateWardDto {
  @IsNumber()
  wardNumber: number;

  @IsMongoId()
  provinceId: string;

  @IsMongoId()
  districtId: string;

  @IsMongoId()
  municipalityId: string;

  @IsMongoId()
  constituencyId: string;
}
