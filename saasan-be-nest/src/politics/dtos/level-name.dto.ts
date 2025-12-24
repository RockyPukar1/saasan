import { IsString } from 'class-validator';

export class LevelNameDto {
  @IsString()
  levelName: string;
}
