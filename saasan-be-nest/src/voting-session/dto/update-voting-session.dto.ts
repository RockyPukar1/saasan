import { PartialType } from '@nestjs/mapped-types';
import { CreateVotingSessionDto } from './create-voting-session.dto';

export class UpdateVotingSessionDto extends PartialType(CreateVotingSessionDto) {}
