import { Injectable } from '@nestjs/common';
import { ResponseHelper } from 'src/common/helpers/response.helper';
import { PositionRepository } from '../repositories/position.repository';
import { PositionSerializer } from '../serializers/positions.serializer';

@Injectable()
export class PositionService {
  constructor(private readonly positionRepo: PositionRepository) {}

  async getPositions() {
    const position = await this.positionRepo.getPositions();
    return ResponseHelper.response(
      PositionSerializer,
      position,
      'Positions fetched successfully',
    );
  }
}
