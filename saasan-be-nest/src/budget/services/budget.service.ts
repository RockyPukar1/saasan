import { Injectable } from '@nestjs/common';
import { ResponseHelper } from 'src/common/helpers/response.helper';
import { BudgetRepository } from '../repositories/budget.repository';

@Injectable()
export class BudgetService {
  constructor(private readonly budgetRepo: BudgetRepository) {}

  async getAll() {
    const budgets = await this.budgetRepo.getAll();
    return ResponseHelper.success(budgets);
  }
}
