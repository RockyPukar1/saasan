import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PartyEntity, PartyEntitySchema } from './entities/party.entity';
import { PartyController } from './controllers/party.controller';
import { PartyService } from './services/party.service';
import { PartyRepository } from './repositories/party.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PartyEntity.name, schema: PartyEntitySchema },
    ]),
  ],
  controllers: [PartyController],
  providers: [PartyService, PartyRepository],
})
export class PartyModule {}
