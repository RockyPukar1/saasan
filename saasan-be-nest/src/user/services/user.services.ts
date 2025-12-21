import { Injectable } from '@nestjs/common';
import { UserIdDto } from '../dtos/user-id.dto';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepo: UserRepository) {}

  async getUserById({ userId }: UserIdDto) {
    return this.doesUserExists({ _id: userId }).lean();
  }

  private doesUserExists(filter: any) {
    return this.userRepo.findOne(filter);
  }
}
