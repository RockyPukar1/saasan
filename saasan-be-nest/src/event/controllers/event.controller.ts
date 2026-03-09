import { Controller, Get, UseGuards } from '@nestjs/common';
import { HttpAccessTokenGuard } from '@/common/guards/http-access-token.guard';
import { EventService } from '../services/event.service';

@UseGuards(HttpAccessTokenGuard)
@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get()
  async getAll() {
    return this.eventService.getAll();
  }
}
