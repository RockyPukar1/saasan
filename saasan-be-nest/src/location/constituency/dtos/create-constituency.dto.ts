import { IsMongoId, IsNumber } from 'class-validator';

export class CreateConstituencyDto {
  @IsMongoId()
  provinceId: string;

  @IsMongoId()
  districtId: string;

  @IsNumber()
  constituencyNumber: number;
}
