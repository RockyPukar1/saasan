import { IsNumber, IsString } from 'class-validator';

export class CreateProvinceDto {
  @IsString()
  name: string;

  @IsNumber()
  provinceNumber: number;

  @IsString()
  capital: string;
}
