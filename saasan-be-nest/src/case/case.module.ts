import { Module } from '@nestjs/common';
import { CaseRepository } from './repositories/case.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { CaseEntity, CaseEntitySchema } from './entities/case.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CaseEntity.name, schema: CaseEntitySchema },
    ]),
  ],
  providers: [CaseRepository],
  exports: [CaseRepository]
})
export class CaseModule {}
