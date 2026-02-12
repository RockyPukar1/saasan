import {
  IsArray,
  IsBoolean,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

// Promise DTO
class PromiseDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  status: 'ongoing' | 'fulfilled' | 'broken';

  @IsOptional()
  @IsString()
  dueDate?: Date;

  @IsOptional()
  @IsNumber()
  progress?: number;
}

// Achievement DTO
class AchievementDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  category: 'policy' | 'development' | 'social' | 'economic';

  @IsOptional()
  @IsString()
  date?: Date;
}

// Contact DTO
class ContactDto {
  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  website?: string;
}

// Social Media DTO
class SocialMediaDto {
  @IsOptional()
  @IsString()
  facebook?: string;

  @IsOptional()
  @IsString()
  twitter?: string;

  @IsOptional()
  @IsString()
  instagram?: string;
}

export class CreatePoliticianDto {
  @IsString()
  fullName: string;

  @IsOptional()
  @IsNumber()
  age?: number;

  @IsOptional()
  @IsString()
  biography?: string;

  @IsOptional()
  @IsString()
  education?: string;

  @IsOptional()
  @IsString()
  profession?: string;

  @IsOptional()
  @IsMongoId()
  constituencyId?: string;

  @IsOptional()
  @IsBoolean()
  isIndependent?: boolean;

  @IsOptional()
  @IsMongoId()
  partyId?: string;

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  positionIds?: string[];

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  levelIds?: string[];

  @IsOptional()
  @IsNumber()
  experienceYears?: number;

  @IsOptional()
  @IsNumber()
  rating?: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => ContactDto)
  contact?: ContactDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => SocialMediaDto)
  socialMedia?: SocialMediaDto;

  @IsOptional()
  @IsArray()
  @Type(() => PromiseDto)
  promises?: PromiseDto[];

  @IsOptional()
  @IsArray()
  @Type(() => AchievementDto)
  achievements?: AchievementDto[];
}
