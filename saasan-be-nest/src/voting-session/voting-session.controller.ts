import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { VotingSessionService } from './voting-session.service';
import { CreateVotingSessionDto } from './dto/create-voting-session.dto';
import { UpdateVotingSessionDto } from './dto/update-voting-session.dto';

@Controller('voting-session')
export class VotingSessionController {
  constructor(private readonly votingSessionService: VotingSessionService) {}

  @Post()
  create(@Body() createVotingSessionDto: CreateVotingSessionDto) {
    return this.votingSessionService.create(createVotingSessionDto);
  }

  @Get()
  findAll() {
    return this.votingSessionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.votingSessionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVotingSessionDto: UpdateVotingSessionDto) {
    return this.votingSessionService.update(+id, updateVotingSessionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.votingSessionService.remove(+id);
  }
}
