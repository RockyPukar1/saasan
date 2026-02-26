import { IsString } from 'class-validator';

export class ConstituencyIdDto {
  @IsString()
  constituencyId: string;
}
