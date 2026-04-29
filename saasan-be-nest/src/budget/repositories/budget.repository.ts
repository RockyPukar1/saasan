import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BudgetEntity, BudgetEntityDocument } from '../entities/budget.entity';

@Injectable()
export class BudgetRepository {
  constructor(
    @InjectModel(BudgetEntity.name)
    private readonly model: Model<BudgetEntityDocument>,
  ) {}

  async getAll() {
    return this.model.find().sort({ year: -1, amount: -1 }).exec();
  }
}
