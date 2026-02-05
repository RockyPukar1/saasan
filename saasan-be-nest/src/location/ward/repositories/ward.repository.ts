import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { WardEntity, WardEntityDocument } from '../entities/ward.entity';
import { CreateWardDto } from '../dtos/create-ward.dto';
import { MunicipalityIdDto } from 'src/location/municipality/dtos/municipality-id.dto';

export class WardRepository {
  constructor(
    @InjectModel(WardEntity.name)
    private readonly model: Model<WardEntityDocument>,
  ) {}

  findOne(filter: any) {
    return this.model.findOne(filter);
  }

  async findById(wardId: string) {
    return await this.model.findById(wardId);
  }

  async findByMunicipalityId({ municipalityId }: MunicipalityIdDto) {
    return this.model.find({ municipalityId: new Types.ObjectId(municipalityId) });
  }

  async create(wardData: CreateWardDto) {
    await this.model.create(wardData);
  }
}
