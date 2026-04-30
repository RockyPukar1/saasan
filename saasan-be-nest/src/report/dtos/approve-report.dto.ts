import { IsArray, IsMongoId, IsOptional, IsString, ArrayMinSize } from 'class-validator';

export class ApproveReportDto {
  @IsArray()
  @ArrayMinSize(1)
  @IsMongoId({ each: true })
  politicianIds: string[];

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  escalateToHigher?: boolean;
}
