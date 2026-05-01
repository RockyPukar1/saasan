import { IsIn, IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { CasePriority, CaseStatus } from '../entities/case.entity';

export class GetCasesDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsIn(Object.values(CaseStatus))
  status?: CaseStatus;

  @IsOptional()
  @IsIn(Object.values(CasePriority))
  priority?: CasePriority;
}
