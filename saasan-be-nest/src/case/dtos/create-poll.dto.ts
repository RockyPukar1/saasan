import {
  IsArray,
  IsBoolean,
  IsDate,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreatePollDto {
  @IsString()
  title: string;

  @IsArray()
  options: string[];

  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsString()
  status?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsDate()
  startDate: Date;

  @IsDate()
  endDate: Date;

  @IsBoolean()
  requiresVerification?: boolean;
}
