import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ReportStatus } from '../entities/report.entity';

export class CreateReportDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsMongoId()
  reporterId?: string;

  @IsOptional()
  @IsNumber()
  amountInvolved?: number;

  @IsOptional()
  @IsMongoId()
  provinceId?: string;

  @IsOptional()
  @IsMongoId()
  districtId?: string;

  @IsOptional()
  @IsMongoId()
  constituencyId?: string;

  @IsOptional()
  @IsMongoId()
  municipalityId?: string;

  @IsOptional()
  @IsMongoId()
  wardId?: string;
}
