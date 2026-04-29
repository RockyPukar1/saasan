import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BudgetController } from './controllers/budget.controller';
import { BudgetEntity, BudgetEntitySchema } from './entities/budget.entity';
import { BudgetRepository } from './repositories/budget.repository';
import { BudgetService } from './services/budget.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BudgetEntity.name, schema: BudgetEntitySchema },
    ]),
  ],
  controllers: [BudgetController],
  providers: [BudgetService, BudgetRepository],
  exports: [BudgetRepository],
})
export class BudgetModule {}
