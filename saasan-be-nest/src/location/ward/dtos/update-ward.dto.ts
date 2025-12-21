import { IsMongoId, IsNumber } from 'class-validator';

export class UpdateWardDto {
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
