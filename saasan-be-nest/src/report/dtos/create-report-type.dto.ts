import { IsString, IsNotEmpty } from 'class-validator';

export class CreateReportTypeDto {
  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}
