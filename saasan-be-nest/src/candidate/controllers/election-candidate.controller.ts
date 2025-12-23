import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ElectionCandidateService } from '../services/election-candidate.service';
import { CreateElectionCandidateDto } from '../dtos/create-election-candidate.dto';
import { UpdateElectionCandidateDto } from '../dtos/update-election-candidate.dto';

@Controller('election-candidate')
export class ElectionCandidateController {
  constructor(
    private readonly electionCandidateService: ElectionCandidateService,
  ) {}

  @Post()
  create(@Body() createElectionCandidateDto: CreateElectionCandidateDto) {
    return this.electionCandidateService.create(createElectionCandidateDto);
  }

  @Get()
  findAll() {
    return this.electionCandidateService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.electionCandidateService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateElectionCandidateDto: UpdateElectionCandidateDto,
  ) {
    return this.electionCandidateService.update(
      +id,
      updateElectionCandidateDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.electionCandidateService.remove(+id);
  }
}
