import { IsMongoId } from 'class-validator';

export class PoliticianIdDto {
  @IsMongoId()
  politicianId: string;
}
