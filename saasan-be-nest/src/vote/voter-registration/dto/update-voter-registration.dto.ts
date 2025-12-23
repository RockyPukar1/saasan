import { PartialType } from '@nestjs/mapped-types';
import { CreateVoterRegistrationDto } from './create-voter-registration.dto';

export class UpdateVoterRegistrationDto extends PartialType(CreateVoterRegistrationDto) {}
