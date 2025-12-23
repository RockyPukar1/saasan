import { Injectable } from '@nestjs/common';
import { CreateVoterIntentSurveyDto } from './dto/create-voter-intent-survey.dto';
import { UpdateVoterIntentSurveyDto } from './dto/update-voter-intent-survey.dto';

@Injectable()
export class VoterIntentSurveyService {
  create(createVoterIntentSurveyDto: CreateVoterIntentSurveyDto) {
    return 'This action adds a new voterIntentSurvey';
  }

  findAll() {
    return `This action returns all voterIntentSurvey`;
  }

  findOne(id: number) {
    return `This action returns a #${id} voterIntentSurvey`;
  }

  update(id: number, updateVoterIntentSurveyDto: UpdateVoterIntentSurveyDto) {
    return `This action updates a #${id} voterIntentSurvey`;
  }

  remove(id: number) {
    return `This action removes a #${id} voterIntentSurvey`;
  }
}
