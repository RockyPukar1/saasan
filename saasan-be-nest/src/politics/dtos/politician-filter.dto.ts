import { IsArray, IsMongoId, IsOptional } from 'class-validator';

export class PoliticianFilterDto {
  @IsArray()
  @IsMongoId({ each: true })
  level: string[];

  @IsArray()
  @IsMongoId({ each: true })
  party: string[];

  @IsArray()
  @IsMongoId({ each: true })
  position: string[];
}
