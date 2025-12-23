import { Module } from '@nestjs/common';
import { PoliticianController } from './controllers/politician.controller';
import { PoliticianService } from './services/politician.service';
import { PoliticianRepository } from './repositories/politician.repository';
import { MongooseModule } from '@nestjs/mongoose';
import {
  PoliticianEntity,
  PoliticianEntitySchema,
} from './entities/politician.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PoliticianEntity.name, schema: PoliticianEntitySchema },
    ]),
  ],
  controllers: [PoliticianController],
  providers: [PoliticianService, PoliticianRepository],
  exports: [PoliticianRepository],
})
export class PoliticsModule {}
