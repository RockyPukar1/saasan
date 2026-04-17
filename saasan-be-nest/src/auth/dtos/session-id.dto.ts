import { IsMongoId } from 'class-validator';

export class SessionIdDto {
  @IsMongoId()
  sessionId: string;
}
