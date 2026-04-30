import {
  IsDateString,
  IsEnum,
  IsInt,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { PoliticianPromiseStatus } from '../entities/politician-promise.entity';

export class UpsertPoliticianPromiseDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsEnum(PoliticianPromiseStatus)
  status: PoliticianPromiseStatus;

  @IsDateString()
  dueDate: string;

  @IsInt()
  @Min(0)
  @Max(100)
  progress: number;
}
