import { Module } from '@nestjs/common';
import { VoterIntentSurveyService } from './voter-intent-survey.service';
import { VoterIntentSurveyController } from './voter-intent-survey.controller';

@Module({
  controllers: [VoterIntentSurveyController],
  providers: [VoterIntentSurveyService],
})
export class VoterIntentSurveyModule {}
