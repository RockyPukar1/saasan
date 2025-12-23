import { Module } from '@nestjs/common';
import { CandidateComparisionCriteriaController } from './controllers/candidate-comparision-criteria.controller';
import { CandidateComparisionCriteriaService } from './services/candidate-comparision-criteria.service';

@Module({
  controllers: [CandidateComparisionCriteriaController],
  providers: [CandidateComparisionCriteriaService],
})
export class CandidateComparisionCriteriaModule {}
