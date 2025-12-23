import { IsMongoId } from 'class-validator';

export class VoteDto {
  @IsMongoId()
  pollId: string;

  @IsMongoId()
  optionId: string;
}
