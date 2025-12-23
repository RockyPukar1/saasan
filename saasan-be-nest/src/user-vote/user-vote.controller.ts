import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserVoteService } from './user-vote.service';
import { CreateUserVoteDto } from './dto/create-user-vote.dto';
import { UpdateUserVoteDto } from './dto/update-user-vote.dto';

@Controller('user-vote')
export class UserVoteController {
  constructor(private readonly userVoteService: UserVoteService) {}

  @Post()
  create(@Body() createUserVoteDto: CreateUserVoteDto) {
    return this.userVoteService.create(createUserVoteDto);
  }

  @Get()
  findAll() {
    return this.userVoteService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userVoteService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserVoteDto: UpdateUserVoteDto,
  ) {
    return this.userVoteService.update(+id, updateUserVoteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userVoteService.remove(+id);
  }
}
