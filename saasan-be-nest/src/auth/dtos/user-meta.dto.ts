import { IsIP, IsOptional, IsString } from 'class-validator';

export class UserMetaDto {
  @IsOptional()
  @IsIP()
  ipAddress?: string;

  @IsOptional()
  @IsString()
  userAgent?: string;
}
