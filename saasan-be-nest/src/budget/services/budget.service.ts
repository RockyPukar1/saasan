import { Injectable } from '@nestjs/common';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { paginateArrayByCursor } from 'src/common/helpers/cursor-pagination.helper';
import { ResponseHelper } from 'src/common/helpers/response.helper';
import { BudgetRepository } from '../repositories/budget.repository';
import { BudgetSerializer } from '../serializers/budget.serializer';

@Injectable()
export class BudgetService {
  constructor(private readonly budgetRepo: BudgetRepository) {}

  async getAll({ cursor, limit }: PaginationQueryDto) {
    const budgets = await this.budgetRepo.getAll();
    return ResponseHelper.response(
      BudgetSerializer,
      paginateArrayByCursor(budgets, cursor, limit),
      'Budgets fetched successfully',
    );
  }
}
