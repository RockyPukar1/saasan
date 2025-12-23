import { PartialType } from '@nestjs/mapped-types';
import { CreateUserVoteDto } from './create-user-vote.dto';

export class UpdateUserVoteDto extends PartialType(CreateUserVoteDto) {}
