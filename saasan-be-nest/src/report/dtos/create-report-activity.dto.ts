import { IsEnum, IsMongoId, IsString, ValidateNested } from 'class-validator';
import { ReportActivityCategoryEnum } from '../entities/report-activity.entity';
import { Type } from 'class-transformer';

class ModifiedBy {
  @IsMongoId()
  id: string;

  @IsString()
  fullName: string;
}
export class CreateReportActivityDto {
  @IsMongoId()
  reportId: string;

  @IsEnum(ReportActivityCategoryEnum)
  category: string;

  @ValidateNested()
  @Type(() => ModifiedBy)
  modifiedBy: ModifiedBy;

  @IsString()
  oldValue: string;

  @IsString()
  newValue: string;

  @IsString()
  comment: string;
}
