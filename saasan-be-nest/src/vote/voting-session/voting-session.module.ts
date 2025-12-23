import { Module } from '@nestjs/common';
import { VotingSessionService } from './voting-session.service';
import { VotingSessionController } from './voting-session.controller';

@Module({
  controllers: [VotingSessionController],
  providers: [VotingSessionService],
})
export class VotingSessionModule {}
