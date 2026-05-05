import { Controller, Get, Query } from '@nestjs/common';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { LevelService } from '../services/level.service';

@Controller('level')
export class LevelController {
  constructor(private readonly levelService: LevelService) {}

  @Get()
  async getLevels(@Query() paginationQuery: PaginationQueryDto) {
    return await this.levelService.getLevels(paginationQuery);
  }
}
