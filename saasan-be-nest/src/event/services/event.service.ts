import { HttpStatus, Injectable } from '@nestjs/common';
import { EventRepository } from '../repositories/event.repository';
import { ResponseHelper } from 'src/common/helpers/response.helper';
import { CreateEventDto } from '../dtos/create-event.dto';
import { UpdateEventDto } from '../dtos/update-event.dto';
import { GlobalHttpException } from 'src/common/exceptions/global-http.exception';

@Injectable()
export class EventService {
  constructor(private readonly eventRepo: EventRepository) {}

  async getAll() {
    const events = await this.eventRepo.getAll();
    return ResponseHelper.success(events);
  }

  async getById(id: string) {
    const event = await this.eventRepo.getById(id);
    if (!event) {
      throw new GlobalHttpException('event404', HttpStatus.NOT_FOUND);
    }

    return ResponseHelper.success(event);
  }

  async create(data: CreateEventDto) {
    const event = await this.eventRepo.create(data);
    return ResponseHelper.success(event, 'Event created successfully');
  }

  async update(id: string, data: UpdateEventDto) {
    const event = await this.eventRepo.update(id, data);
    if (!event) {
      throw new GlobalHttpException('event404', HttpStatus.NOT_FOUND);
    }

    return ResponseHelper.success(event, 'Event updated successfully');
  }

  async delete(id: string) {
    const deleted = await this.eventRepo.delete(id);
    if (!deleted) {
      throw new GlobalHttpException('event404', HttpStatus.NOT_FOUND);
    }
  }
}
