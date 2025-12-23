import { Injectable } from '@nestjs/common';
import { CreateCandidateComparisionCriterionDto } from '../dto/create-candidate-comparision-criterion.dto';
import { UpdateCandidateComparisionCriterionDto } from '../dto/update-candidate-comparision-criterion.dto';

@Injectable()
export class CandidateComparisionCriteriaService {
  create(
    createCandidateComparisionCriterionDto: CreateCandidateComparisionCriterionDto,
  ) {
    return 'This action adds a new candidateComparisionCriterion';
  }

  findAll() {
    return `This action returns all candidateComparisionCriteria`;
  }

  findOne(id: number) {
    return `This action returns a #${id} candidateComparisionCriterion`;
  }

  update(
    id: number,
    updateCandidateComparisionCriterionDto: UpdateCandidateComparisionCriterionDto,
  ) {
    return `This action updates a #${id} candidateComparisionCriterion`;
  }

  remove(id: number) {
    return `This action removes a #${id} candidateComparisionCriterion`;
  }
}
