import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PollService } from '../services/poll.service';
import { VoteDto } from '../dtos/vote.dto';
import { HttpAccessTokenGuard } from 'src/common/guards/http-access-token.guard';
import { type Request } from 'express';
import { CreatePollDto } from '../dtos/create-poll.dto';
import { UpdatePollDto } from '../dtos/update-poll.dto';

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
    return await this.pollService.create(data);
  }

  @Put(':pollId')
  async update(
    @Param('pollId') pollId: string,
    @Body() data: UpdatePollDto,
  ) {
    return await this.pollService.update(pollId, data);
  }

  @HttpCode(204)
  @Delete(':pollId')
  async delete(@Param('pollId') pollId: string) {
    await this.pollService.delete(pollId);
  }

  @HttpCode(204)
  @Post(':pollId/vote/:optionId')
  async vote(@Req() req: Request, @Param() data: VoteDto) {
    await this.pollService.vote(req.user.id, data);
  }

  @Get('analytics')
  async getAnalytics() {
    return await this.pollService.getAnalytics();
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
