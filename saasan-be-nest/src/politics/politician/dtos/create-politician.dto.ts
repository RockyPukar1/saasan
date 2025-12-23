import {
  IsBoolean,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreatePoliticianDto {
  @IsString()
  fullName: string;

  @IsNumber()
  age: number;

  @IsString()
  biography: string;

  @IsString()
  education: string;

  @IsString()
  profession: string;

  @IsMongoId()
  constituencyId?: string;

  @IsBoolean()
  @IsOptional()
  isIndependent?: boolean;

  @IsMongoId()
  partyId?: string;

  @IsMongoId()
  positionId?: string;

  @IsNumber()
  @IsOptional()
  experienceYears?: number;

  @IsNumber()
  @IsOptional()
  rating?: number;
}
