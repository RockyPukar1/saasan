import { IsArray, IsMongoId, IsOptional } from 'class-validator';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';

export class PoliticianFilterDto extends PaginationQueryDto {
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  level?: string[];

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  party?: string[];

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  position?: string[];
}
