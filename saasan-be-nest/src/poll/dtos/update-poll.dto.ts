import { IsArray, IsBoolean, IsDate, IsOptional, IsString } from 'class-validator';

export class UpdatePollDto {
  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsArray()
  options: string[];

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsDate()
  startDate: Date;

  @IsOptional()
  @IsDate()
  endDate: Date;

  @IsOptional()
  @IsBoolean()
  requiresVerification?: boolean;
}
