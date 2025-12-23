import { PartialType } from '@nestjs/mapped-types';
import { CreateVotingCenterDto } from './create-voting-center.dto';

export class UpdateVotingCenterDto extends PartialType(CreateVotingCenterDto) {}
