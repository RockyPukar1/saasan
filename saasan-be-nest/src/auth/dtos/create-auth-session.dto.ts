import { IsDate, IsMongoId, IsOptional, IsString } from 'class-validator';

export class CreateAuthSessionDto {
  @IsMongoId()
  userId: string;

  @IsString()
  refreshTokenHash: string;

  @IsDate()
  refreshExpiresAt: Date;

  @IsOptional()
  @IsString()
  ipAddress?: string;

  @IsOptional()
  @IsString()
  userAgent?: string;
}
