import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MessageEntity, MessageEntitySchema } from './entities/message.entity';
import { MessageController } from './controllers/message.controller';
import { MessageService } from './services/message.service';
import { MessageRepository } from './repositories/message.repository';
import { LocationModule } from 'src/location/location.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MessageEntity.name, schema: MessageEntitySchema },
    ]),
    LocationModule,
  ],
  controllers: [MessageController],
  providers: [MessageService, MessageRepository],
  exports: [MessageService, MessageRepository],
})
export class MessageModule {}
