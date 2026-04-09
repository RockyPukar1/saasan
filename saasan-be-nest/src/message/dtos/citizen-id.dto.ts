import { IsMongoId } from 'class-validator';

export class CitizenIdDto {
  @IsMongoId()
  citizenId: string;
}
