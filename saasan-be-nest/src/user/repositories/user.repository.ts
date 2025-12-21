import { InjectModel } from '@nestjs/mongoose';
import { RegisterUserDto } from 'src/auth/dtos/register.dto';
import { UserEntity, UserEntityDocument } from '../entities/user.entity';
import { Model } from 'mongoose';

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

  findOne(filter: any) {
    return this.model.findOne(filter);
  }

  async create(userData: RegisterUserDto) {
    return await this.model.create(userData);
  }
}
