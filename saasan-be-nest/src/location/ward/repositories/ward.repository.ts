import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WardEntity, WardEntityDocument } from '../entities/ward.entity';
import { CreateWardDto } from '../dtos/create-ward.dto';

export class WardRepository {
  constructor(
    @InjectModel(WardEntity.name)
    private readonly model: Model<WardEntityDocument>,
  ) {}

  findOne(filter: any) {
    return this.model.findOne(filter);
  }

  async create(wardData: CreateWardDto) {
    await this.model.create(wardData);
  }
}
