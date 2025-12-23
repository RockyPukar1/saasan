import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { VoterRegistrationService } from './voter-registration.service';
import { CreateVoterRegistrationDto } from './dto/create-voter-registration.dto';
import { UpdateVoterRegistrationDto } from './dto/update-voter-registration.dto';

@Controller('voter-registration')
export class VoterRegistrationController {
  constructor(private readonly voterRegistrationService: VoterRegistrationService) {}

  @Post()
  create(@Body() createVoterRegistrationDto: CreateVoterRegistrationDto) {
    return this.voterRegistrationService.create(createVoterRegistrationDto);
  }

  @Get()
  findAll() {
    return this.voterRegistrationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.voterRegistrationService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVoterRegistrationDto: UpdateVoterRegistrationDto) {
    return this.voterRegistrationService.update(+id, updateVoterRegistrationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.voterRegistrationService.remove(+id);
  }
}
