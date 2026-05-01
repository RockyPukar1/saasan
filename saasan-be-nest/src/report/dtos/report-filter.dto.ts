import { IsArray, IsMongoId, IsOptional } from 'class-validator';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';

export class ReportFilterDto extends PaginationQueryDto {
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
