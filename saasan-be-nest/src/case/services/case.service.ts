import { Injectable } from '@nestjs/common';
import { CaseRepository } from '../repositories/case.repository';

@Injectable()
export class CaseService {
  constructor(private readonly caseRepo: CaseRepository) {}
}
