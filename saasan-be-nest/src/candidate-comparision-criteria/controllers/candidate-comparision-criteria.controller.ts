import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CandidateComparisionCriteriaService } from './candidate-comparision-criteria.service';
import { CreateCandidateComparisionCriterionDto } from './dto/create-candidate-comparision-criterion.dto';
import { UpdateCandidateComparisionCriterionDto } from './dto/update-candidate-comparision-criterion.dto';

@Controller('candidate-comparision-criteria')
export class CandidateComparisionCriteriaController {
  constructor(private readonly candidateComparisionCriteriaService: CandidateComparisionCriteriaService) {}

  @Post()
  create(@Body() createCandidateComparisionCriterionDto: CreateCandidateComparisionCriterionDto) {
    return this.candidateComparisionCriteriaService.create(createCandidateComparisionCriterionDto);
  }

  @Get()
  findAll() {
    return this.candidateComparisionCriteriaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.candidateComparisionCriteriaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCandidateComparisionCriterionDto: UpdateCandidateComparisionCriterionDto) {
    return this.candidateComparisionCriteriaService.update(+id, updateCandidateComparisionCriterionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.candidateComparisionCriteriaService.remove(+id);
  }
}
