import { Injectable } from '@nestjs/common';
import { CreateElectionCandidateDto } from './dto/create-election-candidate.dto';
import { UpdateElectionCandidateDto } from './dto/update-election-candidate.dto';

@Injectable()
export class ElectionCandidateService {
  create(createElectionCandidateDto: CreateElectionCandidateDto) {
    return 'This action adds a new electionCandidate';
  }

  findAll() {
    return `This action returns all electionCandidate`;
  }

  findOne(id: number) {
    return `This action returns a #${id} electionCandidate`;
  }

  update(id: number, updateElectionCandidateDto: UpdateElectionCandidateDto) {
    return `This action updates a #${id} electionCandidate`;
  }

  remove(id: number) {
    return `This action removes a #${id} electionCandidate`;
  }
}
