import {
  IsBoolean,
  IsIn,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class NotificationPreferencesDto {
  @IsBoolean()
  email: boolean;

  @IsBoolean()
  push: boolean;

  @IsBoolean()
  sms: boolean;

  @IsBoolean()
  messageUpdates: boolean;

  @IsBoolean()
  promiseReminders: boolean;

  @IsBoolean()
  announcementUpdates: boolean;

  @IsBoolean()
  systemNotifications: boolean;

  @IsBoolean()
  weeklySummary: boolean;
}

class AppearancePreferencesDto {
  @IsIn(['light', 'dark', 'system'])
  theme: 'light' | 'dark' | 'system';

  @IsString()
  language: string;

  @IsString()
  timezone: string;

  @IsBoolean()
  compactMode: boolean;

  @IsBoolean()
  showTimestamps: boolean;

  @IsBoolean()
  enableAnimations: boolean;

  @IsBoolean()
  highContrastMode: boolean;
}

class PrivacyPreferencesDto {
  @IsIn(['public', 'constituents_only', 'private'])
  profileVisibility: 'public' | 'constituents_only' | 'private';

  @IsBoolean()
  showContactInfo: boolean;

  @IsBoolean()
  showActivityStatus: boolean;

  @IsBoolean()
  allowMessageRequests: boolean;
}

class AdvancedPreferencesDto {
  @IsBoolean()
  developerMode: boolean;

  @IsBoolean()
  betaFeatures: boolean;
}

export class UpdatePoliticianPreferencesDto {
  @ValidateNested()
  @Type(() => NotificationPreferencesDto)
  notifications: NotificationPreferencesDto;

  @ValidateNested()
  @Type(() => AppearancePreferencesDto)
  appearance: AppearancePreferencesDto;

  @ValidateNested()
  @Type(() => PrivacyPreferencesDto)
  privacy: PrivacyPreferencesDto;

  @ValidateNested()
  @Type(() => AdvancedPreferencesDto)
  advanced: AdvancedPreferencesDto;
}
