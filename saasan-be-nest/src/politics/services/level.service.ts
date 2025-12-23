import { Injectable } from '@nestjs/common';
import { LevelRepository } from '../repositories/level.repository';

@Injectable()
export class LevelService {
  constructor(private readonly levelRepo: LevelRepository) {}
}
