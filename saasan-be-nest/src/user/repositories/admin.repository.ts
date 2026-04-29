import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AdminEntity, AdminEntityDocument } from '../entities/admin.entity';
import { UserIdDto } from '../dtos/user-id.dto';

@Injectable()
export class AdminRepository {
  constructor(
    @InjectModel(AdminEntity.name)
    private readonly model: Model<AdminEntityDocument>,
  ) {}

  async create(adminData: Partial<AdminEntity> | Record<string, any>) {
    return this.model.create(adminData);
  }

  findByUserId({ userId }: UserIdDto) {
    return this.model.findOne({ userId: new Types.ObjectId(userId) });
  }

  async findByUserIdAndUpdate(
    { userId }: UserIdDto,
    updateData: Partial<AdminEntity> | Record<string, any>,
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
