import { Controller, Get, UseGuards } from '@nestjs/common';
import { HttpAccessTokenGuard } from 'src/common/guards/http-access-token.guard';
import { BudgetService } from '../services/budget.service';

@UseGuards(HttpAccessTokenGuard)
@Controller('budget')
export class BudgetController {
  constructor(private readonly budgetService: BudgetService) {}

  @Get()
  async getAll() {
    return this.budgetService.getAll();
  }
}
