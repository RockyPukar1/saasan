import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsMongoId,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';
import { CasePriority, CaseStatus } from '../entities/case.entity';

export class CreateCaseDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsEnum(CaseStatus)
  status: CaseStatus;

  @IsOptional()
  @IsEnum(CasePriority)
  priority?: CasePriority;

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

  @IsOptional()
  @IsString()
  locationDescription?: string;

  @IsNumber()
  peopleAffectedCount: number;

  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;
}
