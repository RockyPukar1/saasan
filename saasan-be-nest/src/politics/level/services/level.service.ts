import { Injectable } from '@nestjs/common';
import { LevelRepository } from '../repositories/level.repository';
import { ResponseHelper } from 'src/common/helpers/response.helper';
import { LevelSerializer } from '../serializers/level.serializer';

@Injectable()
export class LevelService {
  constructor(private readonly levelRepo: LevelRepository) {}

  async getLevels() {
    const levels = await this.levelRepo.getLevels();
    return ResponseHelper.response(
      LevelSerializer,
      levels,
      'Levels fetched successfully',
    );
  }
}
