import { IsMongoId, IsOptional, IsString } from 'class-validator';

export class AdminUpdateReportDto {
  @IsOptional()
  @IsMongoId()
  priorityId?: string;

  @IsOptional()
  @IsMongoId()
  typeId?: string;

  @IsOptional()
  @IsMongoId()
  statusId?: string;

  @IsOptional()
  @IsMongoId()
  visibilityId?: string;

  @IsString()
  comment: string;
}
