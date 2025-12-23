import { Module } from '@nestjs/common';
import { ElectionCandidateService } from './election-candidate.service';
import { ElectionCandidateController } from './election-candidate.controller';

@Module({
  controllers: [ElectionCandidateController],
  providers: [ElectionCandidateService],
})
export class ElectionCandidateModule {}
