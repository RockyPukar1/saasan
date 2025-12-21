import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ConstituencyEntity,
  ConstituencyEntityDocument,
} from '../entities/constituency.entity';
import { CreateConstituencyDto } from '../dtos/create-constituency.dto';

export class ConstituencyRepository {
  constructor(
    @InjectModel(ConstituencyEntity.name)
    private readonly model: Model<ConstituencyEntityDocument>,
  ) {}

  findOne(filter: any) {
    return this.model.findOne(filter);
  }

  async create(constituencyData: CreateConstituencyDto) {
    await this.model.create(constituencyData);
  }
}
