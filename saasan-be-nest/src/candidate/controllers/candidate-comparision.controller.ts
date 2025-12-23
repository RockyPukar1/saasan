import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CreateCandidateComparisionDto } from '../dtos/create-candidate-comparision.dto';
import { UpdateCandidateComparisionDto } from '../dtos/update-candidate-comparision.dto';
import { CandidateComparisionService } from '../services/candidate-comparision.service';

@Controller('candidate-comparision')
export class CandidateComparisionController {
  constructor(
    private readonly candidateComparisionService: CandidateComparisionService,
  ) {}

  @Post()
  create(@Body() createCandidateComparisionDto: CreateCandidateComparisionDto) {
    return this.candidateComparisionService.create(
      createCandidateComparisionDto,
    );
  }

  @Get()
  findAll() {
    return this.candidateComparisionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.candidateComparisionService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCandidateComparisionDto: UpdateCandidateComparisionDto,
  ) {
    return this.candidateComparisionService.update(
      +id,
      updateCandidateComparisionDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.candidateComparisionService.remove(+id);
  }
}
