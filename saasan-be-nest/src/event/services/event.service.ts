import { HttpStatus, Injectable } from '@nestjs/common';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { paginateArrayByCursor } from 'src/common/helpers/cursor-pagination.helper';
import { EventRepository } from '../repositories/event.repository';
import { ResponseHelper } from 'src/common/helpers/response.helper';
import { CreateEventDto } from '../dtos/create-event.dto';
import { UpdateEventDto } from '../dtos/update-event.dto';
import { GlobalHttpException } from 'src/common/exceptions/global-http.exception';
import { EventSerializer } from '../serializers/event.serializer';

@Injectable()
export class EventService {
  constructor(private readonly eventRepo: EventRepository) {}

  async getAll({ cursor, limit }: PaginationQueryDto) {
    const events = await this.eventRepo.getAll();
    return ResponseHelper.response(
      EventSerializer,
      paginateArrayByCursor(events, cursor, limit),
      'Events fetched successfully',
    );
  }

  async getById(id: string) {
    const event = await this.eventRepo.getById(id);
    if (!event) {
      throw new GlobalHttpException('event404', HttpStatus.NOT_FOUND);
    }

    return ResponseHelper.response(
      EventSerializer,
      event,
      'Event fetched successfully',
    );
  }

  async create(data: CreateEventDto) {
    const event = await this.eventRepo.create(data);
    return ResponseHelper.response(
      EventSerializer,
      event,
      'Event created successfully',
    );
  }

  async update(id: string, data: UpdateEventDto) {
    const event = await this.eventRepo.update(id, data);
    if (!event) {
      throw new GlobalHttpException('event404', HttpStatus.NOT_FOUND);
    }

    return ResponseHelper.response(
      EventSerializer,
      event,
      'Event updated successfully',
    );
  }

  async delete(id: string) {
    const deleted = await this.eventRepo.delete(id);
    if (!deleted) {
      throw new GlobalHttpException('event404', HttpStatus.NOT_FOUND);
    }
  }
}
