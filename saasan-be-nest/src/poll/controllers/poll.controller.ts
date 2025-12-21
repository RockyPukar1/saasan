import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PollService } from '../services/poll.service';
import { VoteDto } from '../dtos/vote.dto';
import { HttpAccessTokenGuard } from 'src/common/guards/http-access-token.guard';
import { type Request } from 'express';
import { CreatePollDto } from '../dtos/create-poll.dto';
import { PollIdDto } from '../dtos/poll-id.dto';

@UseGuards(HttpAccessTokenGuard)
@Controller('poll')
export class PollController {
  constructor(private readonly pollService: PollService) {}

  @Get()
  async getAll() {
    return this.pollService.getAll();
  }

  @Get(':pollId')
  async getPollById(@Param() param: PollIdDto) {
    return this.pollService.getPollById(param);
  }

  @HttpCode(201)
  @Post()
  async create(@Body() data: CreatePollDto) {
    this.pollService.create(data);
  }

  @Post(':pollId/vote/:optionId')
  async vote(@Req() req: Request, @Param() data: VoteDto) {
    return this.pollService.vote(req.user.id, data);
  }
}
