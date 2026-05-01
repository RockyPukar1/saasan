import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { HttpAccessTokenGuard } from 'src/common/guards/http-access-token.guard';
import { EventService } from '../services/event.service';
import { RoleGuard } from 'src/common/guards/role.guard';
import { PermissionGuard } from 'src/common/guards/permission.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/user/entities/user.entity';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { PERMISSIONS } from 'src/common/constants/permission.constants';
import { CreateEventDto } from '../dtos/create-event.dto';
import { UpdateEventDto } from '../dtos/update-event.dto';

@UseGuards(HttpAccessTokenGuard)
@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get()
  async getAll() {
    return this.eventService.getAll();
  }

  @Get(':eventId')
  async getById(@Param('eventId') eventId: string) {
    return await this.eventService.getById(eventId);
  }

  @UseGuards(RoleGuard, PermissionGuard)
  @Roles(UserRole.ADMIN)
  @Permissions(PERMISSIONS.dashboard.view)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(@Body() data: CreateEventDto) {
    return await this.eventService.create(data);
  }

  @UseGuards(RoleGuard, PermissionGuard)
  @Roles(UserRole.ADMIN)
  @Permissions(PERMISSIONS.dashboard.view)
  @Put(':eventId')
  async update(
    @Param('eventId') eventId: string,
    @Body() data: UpdateEventDto,
  ) {
    return await this.eventService.update(eventId, data);
  }

  @UseGuards(RoleGuard, PermissionGuard)
  @Roles(UserRole.ADMIN)
  @Permissions(PERMISSIONS.dashboard.view)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':eventId')
  async delete(@Param('eventId') eventId: string) {
    await this.eventService.delete(eventId);
  }
}
