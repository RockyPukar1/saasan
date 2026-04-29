import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  CitizenEntity,
  CitizenEntityDocument,
} from '../entities/citizen.entity';
import { UserIdDto } from '../dtos/user-id.dto';

@Injectable()
export class CitizenRepository {
  constructor(
    @InjectModel(CitizenEntity.name)
    private readonly model: Model<CitizenEntityDocument>,
  ) {}

  async create(citizenData: Partial<CitizenEntity> | Record<string, any>) {
    return this.model.create(citizenData);
  }

  findByUserId({ userId }: UserIdDto) {
    return this.model.findOne({ userId: new Types.ObjectId(userId) });
  }

  async findByUserIdAndUpdate(
    { userId }: UserIdDto,
    updateData: Partial<CitizenEntity> | Record<string, any>,
  ) {
    return this.model.findOneAndUpdate(
      { userId: new Types.ObjectId(userId) },
      updateData,
      { new: true },
    );
  }

  async deleteByUserId({ userId }: UserIdDto): Promise<void> {
    await this.model.deleteOne({ userId: new Types.ObjectId(userId) });
  }
}
