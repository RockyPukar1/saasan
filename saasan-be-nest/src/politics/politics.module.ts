import { Module } from '@nestjs/common';
import { PoliticianController } from './controllers/politician.controller';
import { PoliticianService } from './services/politician.service';
import { PoliticianRepository } from './repositories/politician.repository';
import { MongooseModule } from '@nestjs/mongoose';
import {
  PoliticianEntity,
  PoliticianEntitySchema,
} from './entities/politician.entity';
import { LevelEntity, LevelEntitySchema } from './entities/level.entity';
import { LevelController } from './controllers/level.controller';
import { LevelService } from './services/level.service';
import { LevelRepository } from './repositories/level.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PoliticianEntity.name, schema: PoliticianEntitySchema },
      { name: LevelEntity.name, schema: LevelEntitySchema },
    ]),
  ],
  controllers: [PoliticianController, LevelController],
  providers: [
    PoliticianService,
    PoliticianRepository,
    LevelService,
    LevelRepository,
  ],
  exports: [PoliticianRepository],
})
export class PoliticsModule {}
