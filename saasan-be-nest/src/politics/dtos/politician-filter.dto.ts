import { IsArray, IsMongoId, IsOptional } from 'class-validator';

export class PoliticianFilterDto {
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  level?: string[];

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  party?: string[];

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  position?: string[];
}
