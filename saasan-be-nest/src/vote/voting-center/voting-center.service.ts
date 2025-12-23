import { Injectable } from '@nestjs/common';
import { CreateVotingCenterDto } from './dto/create-voting-center.dto';
import { UpdateVotingCenterDto } from './dto/update-voting-center.dto';

@Injectable()
export class VotingCenterService {
  create(createVotingCenterDto: CreateVotingCenterDto) {
    return 'This action adds a new votingCenter';
  }

  findAll() {
    return `This action returns all votingCenter`;
  }

  findOne(id: number) {
    return `This action returns a #${id} votingCenter`;
  }

  update(id: number, updateVotingCenterDto: UpdateVotingCenterDto) {
    return `This action updates a #${id} votingCenter`;
  }

  remove(id: number) {
    return `This action removes a #${id} votingCenter`;
  }
}
