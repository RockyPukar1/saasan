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

@UseGuards(HttpAccessTokenGuard)
@Controller('poll')
export class PollController {
  constructor(private readonly pollService: PollService) {}

  @Get()
  async getAll(@Req() req: Request) {
    return this.pollService.getAll(req.user.id);
  }

  @HttpCode(201)
  @Post()
  async create(@Body() data: CreatePollDto) {
    this.pollService.create(data);
  }

  @HttpCode(204)
  @Post(':pollId/vote/:optionId')
  async vote(@Req() req: Request, @Param() data: VoteDto) {
    await this.pollService.vote(req.user.id, data);
  }

  @Get('analytics')
  async getAnalytics() {
    return [];
  }

  @Get('categories')
  async getCategories() {
    return this.pollService.getCategories();
  }

  @Get('statuses')
  async getStatuses() {
    return this.pollService.getStatuses();
  }

  @Get('types')
  async getTypes() {
    return this.pollService.getTypes();
  }

  @Get(':pollId')
  async getPollById(@Req() req: Request, @Param('pollId') pollId: string) {
    return this.pollService.getPollById(req.user.id, pollId);
  }
}
