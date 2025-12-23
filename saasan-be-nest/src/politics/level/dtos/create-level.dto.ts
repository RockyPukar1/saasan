import { IsMongoId, IsString } from 'class-validator';

export class CreateLevelDto {
  @IsString()
  name: string;

  @IsString()
  description: string;
}
