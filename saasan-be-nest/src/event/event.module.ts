import { Module } from '@nestjs/common';
import { EventController } from './controllers/event.controller';
import { EventService } from './services/event.service';
import { EventRepository } from './repositories/event.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { EventEntity, EventEntitySchema } from './entities/event.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: EventEntity.name, schema: EventEntitySchema },
    ]),
  ],
  controllers: [EventController],
  providers: [EventService, EventRepository],
  exports: [EventRepository],
})
export class EventModule {}
