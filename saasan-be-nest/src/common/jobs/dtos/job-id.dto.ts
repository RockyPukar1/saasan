import { IsMongoId } from 'class-validator';

export class JobIdDto {
  @IsMongoId()
  jobId: string;
}
