import { Types, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UserEntity, UserEntityDocument } from '../entities/user.entity';
import { UserIdDto } from '../dtos/user-id.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { ChangeEmailDto } from '../dtos/change-email.dto';
import { ChangePasswordDto } from '../dtos/change-password.dto';

export class UserRepository {
  constructor(
    @InjectModel(UserEntity.name)
    private readonly model: Model<UserEntityDocument>,
  ) {}

  async updateLastActive(userId: string) {
    await this.model.findByIdAndUpdate(userId, {
      $set: {
        lastActiveAt: new Date(),
      },
    });
  }

  async findAll({ page = 1, limit = 10 }) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.model.find().skip(skip).limit(limit),
      this.model.countDocuments(),
    ]);

    return { data, total, page, limit };
  }

  findOne(filter: any) {
    return this.model.findOne(filter);
  }

  async findById({ userId }: UserIdDto) {
    return this.model.findById(userId);
  }

  async findByIdAndUpdate(
    { userId }: UserIdDto,
    updateData: UpdateUserDto | ChangeEmailDto | ChangePasswordDto,
  ) {
    return await this.model.findByIdAndUpdate(userId, updateData, {
      new: true,
    });
  }

  async create(userData: Partial<UserEntity> | Record<string, any>) {
    return await this.model.create(userData);
  }

  async findOneAndUpdate(
    filter: any,
    updateData: Partial<UserEntity> | Record<string, any>,
    options: { upsert?: boolean } = {},
  ) {
    return this.model.findOneAndUpdate(filter, updateData, {
      new: true,
      ...options,
    });
  }

  async deleteOne({ userId }: UserIdDto) {
    await this.model.deleteOne({ _id: new Types.ObjectId(userId) });
  }
}
