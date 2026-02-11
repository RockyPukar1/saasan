import { Controller, Get } from '@nestjs/common';
import { LevelService } from '../services/level.service';

@Controller('level')
export class LevelController {
  constructor(private readonly levelService: LevelService) {}

  @Get()
  async getLevels() {
    return await this.levelService.getLevels();
  }
}
