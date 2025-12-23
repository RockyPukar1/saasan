import { Injectable } from '@nestjs/common';
import { CreateVoterRegistrationDto } from './dto/create-voter-registration.dto';
import { UpdateVoterRegistrationDto } from './dto/update-voter-registration.dto';

@Injectable()
export class VoterRegistrationService {
  create(createVoterRegistrationDto: CreateVoterRegistrationDto) {
    return 'This action adds a new voterRegistration';
  }

  findAll() {
    return `This action returns all voterRegistration`;
  }

  findOne(id: number) {
    return `This action returns a #${id} voterRegistration`;
  }

  update(id: number, updateVoterRegistrationDto: UpdateVoterRegistrationDto) {
    return `This action updates a #${id} voterRegistration`;
  }

  remove(id: number) {
    return `This action removes a #${id} voterRegistration`;
  }
}
