import { PartialType } from '@nestjs/mapped-types';
import { CreateCandidateComparisionDto } from './create-candidate-comparision.dto';

export class UpdateCandidateComparisionDto extends PartialType(CreateCandidateComparisionDto) {}
