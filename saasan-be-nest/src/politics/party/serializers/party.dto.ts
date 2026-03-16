import { IsString, IsOptional, IsDate, IsHexColor, IsNotEmpty, Min, Max } from 'class-validator';

export class CreatePartyDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  abbreviation: string;

  @IsString()
  @IsOptional()
  ideology?: string;

  @IsDate()
  @IsNotEmpty()
  foundedIn: Date;

  @IsString()
  @IsOptional()
  logoUrl?: string;

  @IsString()
  @IsHexColor()
  @IsNotEmpty()
  color: string;
}

export class UpdatePartyDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  abbreviation?: string;

  @IsString()
  @IsOptional()
  ideology?: string;

  @IsDate()
  @IsOptional()
  foundedIn?: Date;

  @IsString()
  @IsOptional()
  logoUrl?: string;

  @IsString()
  @IsHexColor()
  @IsOptional()
  color?: string;
}
