import { PartialType } from '@nestjs/mapped-types';
import { CreateVoterIntentSurveyDto } from './create-voter-intent-survey.dto';

export class UpdateVoterIntentSurveyDto extends PartialType(CreateVoterIntentSurveyDto) {}
