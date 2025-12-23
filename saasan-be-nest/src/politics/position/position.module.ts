import { Module } from '@nestjs/common';
import { PositionController } from './controllers/position.controller';
import { PositionService } from './services/position.service';

@Module({
  controllers: [PositionController],
  providers: [PositionService],
})
export class PositionModule {}
