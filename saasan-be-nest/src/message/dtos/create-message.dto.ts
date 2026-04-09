import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsMongoId,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { MessageCategory, MessageUrgency } from '../entities/message.entity';
import { Type } from 'class-transformer';

class MessageEntryDto {
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

class MessageParticipantsDto {
  @IsMongoId()
  citizenId: string;

  @IsOptional()
  politicianId: string;

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  assignedStaffIds?: string[];
}

export class JurisdictionDto {
  @IsOptional()
  @IsMongoId()
  provinceId?: string;

  @IsOptional()
  @IsMongoId()
  districtId?: string;

  @IsOptional()
  @IsMongoId()
  constituencyId?: string;

  @IsOptional()
  @IsMongoId()
  municipalityId?: string;

  @IsOptional()
  @IsMongoId()
  wardId?: string;
}

export class CreateMessageDto {
  @IsString()
  subject: string;

  @IsString()
  content: string;

  @IsEnum(MessageCategory)
  category: MessageCategory;

  @IsEnum(MessageUrgency)
  urgency: MessageUrgency;

  @IsOptional()
  @IsString()
  assignedToOfficerId?: string;

  @IsOptional()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsBoolean()
  isAnonymous?: boolean;

  @ValidateNested()
  @Type(() => JurisdictionDto)
  jurisdiction: JurisdictionDto;

  @ValidateNested()
  @Type(() => MessageParticipantsDto)
  participants: MessageParticipantsDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => MessageEntryDto)
  initialMessage?: MessageEntryDto;
}
