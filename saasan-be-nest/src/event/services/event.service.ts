import { Injectable } from '@nestjs/common';
import { EventRepository } from '../repositories/event.repository';
import { ResponseHelper } from 'src/common/helpers/response.helper';

@Injectable()
export class EventService {
  constructor(private readonly eventRepo: EventRepository) {}

  async getAll() {
    const events = await this.eventRepo.getAll();
    return ResponseHelper.success(events);
  }
}
