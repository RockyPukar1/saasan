import { Injectable } from '@nestjs/common';
import { CreateVotingSessionDto } from './dto/create-voting-session.dto';
import { UpdateVotingSessionDto } from './dto/update-voting-session.dto';

@Injectable()
export class VotingSessionService {
  create(createVotingSessionDto: CreateVotingSessionDto) {
    return 'This action adds a new votingSession';
  }

  findAll() {
    return `This action returns all votingSession`;
  }

  findOne(id: number) {
    return `This action returns a #${id} votingSession`;
  }

  update(id: number, updateVotingSessionDto: UpdateVotingSessionDto) {
    return `This action updates a #${id} votingSession`;
  }

  remove(id: number) {
    return `This action removes a #${id} votingSession`;
  }
}
