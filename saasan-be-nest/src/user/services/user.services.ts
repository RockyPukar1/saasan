import { Types } from 'mongoose';
import { Injectable, Logger, HttpStatus } from '@nestjs/common';
import { UserEntity } from '../entities/user.entity';
import { UserRepository } from '../repositories/user.repository';
import { RedisCacheService } from 'src/common/cache/services/redis-cache.service';
import { ResponseHelper } from 'src/common/helpers/response.helper';
import { GlobalHttpException } from 'src/common/exceptions/global-http.exception';
import { UserIdDto } from '../dtos/user-id.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { UserSerializer } from '../serializers/user.serializer';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private readonly userRepo: UserRepository,
    private readonly redisCache: RedisCacheService,
  ) {}

  async getProfile({ userId }: UserIdDto) {
    const user = await this.doesUserExists({
      _id: new Types.ObjectId(userId),
    }).lean();
    if (!user) {
      throw new GlobalHttpException('user404', HttpStatus.NOT_FOUND);
    }

    return ResponseHelper.response(
      UserSerializer,
      user,
      'User Profile fetched successfully',
    );
  }

  async updateProfile(userIdDto: UserIdDto, updateData: UpdateUserDto) {
    const user = await this.userRepo.findByIdAndUpdate(userIdDto, updateData);
    if (!user) throw new GlobalHttpException('user404', HttpStatus.NOT_FOUND);

    return ResponseHelper.response(
      UserSerializer,
      user,
      'User Profile updated successfully',
    );
  }

  async getAllUsers({ page = 1, limit = 10 }) {
    const cacheKey = `users:${page}:${limit}`;

    const cached = await this.redisCache.get(cacheKey);

    if (cached) {
      return ResponseHelper.response(
        UserSerializer,
        cached,
        'Users fetched successfully from cache',
      );
    }
    const users = await this.userRepo.findAll({ page, limit });

    this.redisCache.set(cacheKey, users);

    return ResponseHelper.response(
      UserSerializer,
      users,
      'Users fetched successfully',
    );
  }

  async getUserById({ userId }: UserIdDto) {
    const user = await this.doesUserExists({
      _id: new Types.ObjectId(userId),
    }).lean();
    if (!user) throw new GlobalHttpException('user404', HttpStatus.NOT_FOUND);

    return ResponseHelper.response(
      UserSerializer,
      user,
      'User fetched successfully',
    );
  }

  async deleteUser(userIdDto: UserIdDto) {
    const user = await this.doesUserExists({
      _id: new Types.ObjectId(userIdDto.userId),
    });
    if (!user) throw new GlobalHttpException('user404', HttpStatus.NOT_FOUND);

    await this.userRepo.deleteOne(userIdDto);

    this.redisCache.del('users:*');
  }

  private doesUserExists(filter: any) {
    return this.userRepo.findOne(filter);
  }
}
