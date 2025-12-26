import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventSeeder } from './event.seeder';
import {
  EventEntity,
  EventEntitySchema,
} from 'src/event/entities/event.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: EventEntity.name, schema: EventEntitySchema },
    ]),
  ],
  providers: [EventSeeder],
  exports: [EventSeeder],
})
export class EventSeederModule {}
