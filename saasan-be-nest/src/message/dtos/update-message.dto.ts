import { PartialType } from '@nestjs/mapped-types';
import { CreateMessageDto } from './create-message.dto';
import { MessageStatus } from '../entities/message.entity';
import { IsEnum, IsMongoId, IsOptional } from 'class-validator';

export class UpdateMessageDto extends PartialType(CreateMessageDto) {
  @IsOptional()
  @IsEnum(MessageStatus)
  status: MessageStatus;

  @IsOptional()
  @IsMongoId()
  assignedToOfficerId?: string;
}
