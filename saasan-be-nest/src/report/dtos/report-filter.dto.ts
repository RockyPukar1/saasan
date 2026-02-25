import { IsArray, IsMongoId, IsOptional, IsString } from 'class-validator';

export class ReportFilterDto {
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  status?: string[];

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  priority?: string[];

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  visibility?: string[];

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  type?: string[];
}
