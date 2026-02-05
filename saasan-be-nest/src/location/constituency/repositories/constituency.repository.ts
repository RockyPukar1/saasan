import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  ConstituencyEntity,
  ConstituencyEntityDocument,
} from '../entities/constituency.entity';
import { CreateConstituencyDto } from '../dtos/create-constituency.dto';
import { WardIdDto } from 'src/location/ward/dtos/ward-id.dto';

export class ConstituencyRepository {
  constructor(
    @InjectModel(ConstituencyEntity.name)
    private readonly model: Model<ConstituencyEntityDocument>,
  ) {}

  findOne(filter: any) {
    return this.model.findOne(filter);
  }

  async findById(id: string) {
    return await this.model.findById(id);
  }

  async findConstituencyByWardId({ wardId }: WardIdDto) {
    
  }

  async create(constituencyData: CreateConstituencyDto) {
    await this.model.create(constituencyData);
  }
}
