import { IsString, IsNotEmpty } from 'class-validator';

export class CreateReportStatusDto {
  @IsString()
  @IsNotEmpty()
  status: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}
