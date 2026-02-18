import {
  IsBoolean,
  IsEnum,
  IsISO8601,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ReportType } from '../entities/report.entity';

export class CreateReportDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsMongoId()
  reporterId: string;

  @IsOptional()
  @IsNumber()
  amountInvolved?: number;

  @IsOptional()
  @IsEnum(ReportType)
  reportType?: string;

  @IsBoolean()
  isAnonymous: boolean;

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

  @IsISO8601()
  dateOccurred: Date;

  @IsOptional()
  @IsNumber()
  peopleAffectedCount?: number;
}
