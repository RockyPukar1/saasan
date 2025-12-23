import { Module } from '@nestjs/common';
import { UserVoteService } from './user-vote.service';
import { UserVoteController } from './user-vote.controller';

@Module({
  controllers: [UserVoteController],
  providers: [UserVoteService],
})
export class UserVoteModule {}
