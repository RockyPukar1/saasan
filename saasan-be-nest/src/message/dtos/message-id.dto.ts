import { IsString } from 'class-validator';

export class MessageIdDto {
  @IsString()
  messageId: string;
}
