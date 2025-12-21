import { IsMongoId } from 'class-validator';

export class PollIdDto {
  @IsMongoId()
  pollId: string;
}
