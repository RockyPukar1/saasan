import { PartialType } from '@nestjs/mapped-types';
import { CreateElectionCandidateDto } from './create-election-candidate.dto';

export class UpdateElectionCandidateDto extends PartialType(CreateElectionCandidateDto) {}
