import { IsNumber, IsString } from 'class-validator';

export class UpdateProvinceDto {
  @IsString()
  name: string;

  @IsNumber()
  provinceNumber: number;

  @IsString()
  capital: string;
}
