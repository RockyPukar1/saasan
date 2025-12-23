import { Module } from '@nestjs/common';
import { VotingCenterService } from './voting-center.service';
import { VotingCenterController } from './voting-center.controller';

@Module({
  controllers: [VotingCenterController],
  providers: [VotingCenterService],
})
export class VotingCenterModule {}
