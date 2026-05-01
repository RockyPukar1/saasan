import { Injectable } from '@nestjs/common';
import { ResponseHelper } from 'src/common/helpers/response.helper';
import { BudgetRepository } from '../repositories/budget.repository';
import { BudgetSerializer } from '../serializers/budget.serializer';

@Injectable()
export class BudgetService {
  constructor(private readonly budgetRepo: BudgetRepository) {}

  async getAll() {
    const budgets = await this.budgetRepo.getAll();
    return ResponseHelper.response(
      BudgetSerializer,
      budgets,
      'Budgets fetched successfully',
    );
  }
}
