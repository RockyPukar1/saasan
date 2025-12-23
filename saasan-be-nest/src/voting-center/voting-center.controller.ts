import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { VotingCenterService } from './voting-center.service';
import { CreateVotingCenterDto } from './dto/create-voting-center.dto';
import { UpdateVotingCenterDto } from './dto/update-voting-center.dto';

@Controller('voting-center')
export class VotingCenterController {
  constructor(private readonly votingCenterService: VotingCenterService) {}

  @Post()
  create(@Body() createVotingCenterDto: CreateVotingCenterDto) {
    return this.votingCenterService.create(createVotingCenterDto);
  }

  @Get()
  findAll() {
    return this.votingCenterService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.votingCenterService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVotingCenterDto: UpdateVotingCenterDto) {
    return this.votingCenterService.update(+id, updateVotingCenterDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.votingCenterService.remove(+id);
  }
}
