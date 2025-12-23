import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsMongoId,
  IsNumber,
  IsNumberString,
  IsOptional,
} from 'class-validator';
import { CaseStatus, CaseUrgency } from '../entities/case.entity';

export class CreateCaseDto {
  title: string;

  description: string;

  status: CaseStatus;

  @IsEnum(CaseUrgency)
  priority: CaseUrgency;

  @IsNumberString()
  amountInvolved: number;

  @IsMongoId()
  @IsOptional()
  provinceId?: string;

  @IsMongoId()
  @IsOptional()
  districtId?: string;

  @IsMongoId()
  @IsOptional()
  constituencyId?: string;

  @IsMongoId()
  @IsOptional()
  municipalityId?: string;

  @IsMongoId()
  @IsOptional()
  wardId?: string;

  @IsDate()
  dateOccurred: Date;

  @IsNumber()
  peopleAffectedCount: number;

  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;
}
