import { IsString, IsNotEmpty } from 'class-validator';

export class CreateReportVisibilityDto {
  @IsString()
  @IsNotEmpty()
  visibility: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}
