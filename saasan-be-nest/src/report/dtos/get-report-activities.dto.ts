import { IsOptional, IsMongoId } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetReportActivitiesDto {
  @IsMongoId()
  reportId: string;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  page?: number = 1;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  limit?: number = 20;
}
