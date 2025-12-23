import { Module } from '@nestjs/common';
import { CandidateComparisionService } from './candidate-comparision.service';
import { CandidateComparisionController } from './controllers/candidate-comparision.controller';

@Module({
  controllers: [CandidateComparisionController],
  providers: [CandidateComparisionService],
})
export class CandidateComparisionModule {}
