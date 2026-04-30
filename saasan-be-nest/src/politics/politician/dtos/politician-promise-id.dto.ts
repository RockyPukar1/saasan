import { IsMongoId } from 'class-validator';

export class PoliticianPromiseIdDto {
  @IsMongoId()
  promiseId: string;
}
