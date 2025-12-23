import { Injectable } from '@nestjs/common';
import { CreateCandidateComparisionDto } from '../dtos/create-candidate-comparision.dto';
import { UpdateCandidateComparisionDto } from '../dtos/update-candidate-comparision.dto';

@Injectable()
export class CandidateComparisionService {
  create(createCandidateComparisionDto: CreateCandidateComparisionDto) {
    return 'This action adds a new candidateComparision';
  }

  findAll() {
    return `This action returns all candidateComparision`;
  }

  findOne(id: number) {
    return `This action returns a #${id} candidateComparision`;
  }

  update(
    id: number,
    updateCandidateComparisionDto: UpdateCandidateComparisionDto,
  ) {
    return `This action updates a #${id} candidateComparision`;
  }

  remove(id: number) {
    return `This action removes a #${id} candidateComparision`;
  }
}
