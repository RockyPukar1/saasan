import { Controller, Get, Query } from '@nestjs/common';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { PositionService } from '../services/position.service';

@Controller('position')
export class PositionController {
  constructor(private readonly positionService: PositionService) {}

  @Get()
  async getParties(@Query() paginationQuery: PaginationQueryDto) {
    return await this.positionService.getPositions(paginationQuery);
  }
}
