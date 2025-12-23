import { IsMongoId, IsString } from 'class-validator';

export class CreatePollOptionsDto {
  @IsMongoId()
  pollId: string;

  @IsString()
  text: string;
}
