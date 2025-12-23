import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { VoterIntentSurveyService } from './voter-intent-survey.service';
import { CreateVoterIntentSurveyDto } from './dto/create-voter-intent-survey.dto';
import { UpdateVoterIntentSurveyDto } from './dto/update-voter-intent-survey.dto';

@Controller('voter-intent-survey')
export class VoterIntentSurveyController {
  constructor(private readonly voterIntentSurveyService: VoterIntentSurveyService) {}

  @Post()
  create(@Body() createVoterIntentSurveyDto: CreateVoterIntentSurveyDto) {
    return this.voterIntentSurveyService.create(createVoterIntentSurveyDto);
  }

  @Get()
  findAll() {
    return this.voterIntentSurveyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.voterIntentSurveyService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVoterIntentSurveyDto: UpdateVoterIntentSurveyDto) {
    return this.voterIntentSurveyService.update(+id, updateVoterIntentSurveyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.voterIntentSurveyService.remove(+id);
  }
}
