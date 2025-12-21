import { IsMongoId, IsNumber, IsString } from 'class-validator';

export class UpdateConstituencyDto {
  @IsMongoId()
  provinceId: string;

  @IsMongoId()
  districtId: string;

  @IsNumber()
  constituencyNumber: number;
}
