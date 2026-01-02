import { Controller, Get } from '@nestjs/common';
import { PositionService } from '../services/position.service';

@Controller('position')
export class PositionController {
  constructor(private readonly positionService: PositionService) {}

  @Get()
  async getParties() {
    return await this.positionService.getPositions();
  }
}
