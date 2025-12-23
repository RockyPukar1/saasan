import { Injectable } from '@nestjs/common';
import { CreateUserVoteDto } from './dto/create-user-vote.dto';
import { UpdateUserVoteDto } from './dto/update-user-vote.dto';

@Injectable()
export class UserVoteService {
  create(createUserVoteDto: CreateUserVoteDto) {
    return 'This action adds a new userVote';
  }

  findAll() {
    return `This action returns all userVote`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userVote`;
  }

  update(id: number, updateUserVoteDto: UpdateUserVoteDto) {
    return `This action updates a #${id} userVote`;
  }

  remove(id: number) {
    return `This action removes a #${id} userVote`;
  }
}
