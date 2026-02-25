import { IsString, IsNotEmpty } from 'class-validator';

export class CreateReportPriorityDto {
  @IsString()
  @IsNotEmpty()
  priority: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}
