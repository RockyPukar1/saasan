import { IsArray, IsOptional, IsString } from 'class-validator';

export class AddReplyDto {
  @IsString()
  content: string;

  @IsOptional()
  @IsArray()
  attachments?: Array<{
    fileName: string;
    fileType: string;
    fileUrl: string;
  }>;
}
