import {
  IsArray,
  IsBoolean,
  IsDate,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdatePollDto {
  @IsString()
  title: string;

  @IsArray()
  options: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsString()
  status?: string;

  @IsString()
  category?: string;

  @IsDate()
  startDate: Date;

  @IsDate()
  endDate: Date;

  @IsBoolean()
  requiresVerification?: boolean;
}
