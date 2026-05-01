import { Module } from '@nestjs/common';
import { CaseRepository } from './repositories/case.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { CaseEntity, CaseEntitySchema } from './entities/case.entity';
import { CaseService } from './services/case.service';
import { CaseController } from './controllers/case.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CaseEntity.name, schema: CaseEntitySchema },
    ]),
  ],
  controllers: [CaseController],
  providers: [CaseRepository, CaseService],
  exports: [CaseRepository, CaseService],
})
export class CaseModule {}
