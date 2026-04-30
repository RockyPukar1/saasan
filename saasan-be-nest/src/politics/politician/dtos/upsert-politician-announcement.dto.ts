import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import {
  PoliticianAnnouncementPriority,
  PoliticianAnnouncementType,
} from '../entities/politician-announcement.entity';

export class UpsertPoliticianAnnouncementDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsEnum(PoliticianAnnouncementType)
  type: PoliticianAnnouncementType;

  @IsEnum(PoliticianAnnouncementPriority)
  priority: PoliticianAnnouncementPriority;

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;

  @IsOptional()
  @IsDateString()
  scheduledAt?: string | null;
}
