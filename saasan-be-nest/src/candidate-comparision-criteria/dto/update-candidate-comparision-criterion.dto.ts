import { PartialType } from '@nestjs/mapped-types';
import { CreateCandidateComparisionCriterionDto } from './create-candidate-comparision-criterion.dto';

export class UpdateCandidateComparisionCriterionDto extends PartialType(CreateCandidateComparisionCriterionDto) {}
