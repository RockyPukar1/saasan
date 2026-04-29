import { Expose, Transform } from 'class-transformer';

export class AuthSessionSerializer {
  @Expose() @Transform(({ obj }) => obj._id as string) id: string;

  @Expose() refreshExpiresAt: Date;
  @Expose() revokedAt?: Date;
  @Expose() revokedReason: string;
  @Expose() lastUsedAt?: Date;
  @Expose() ipAddress?: string;
  @Expose() userAgent?: string;
  @Expose() isActive: boolean;

  @Expose() createdAt: string;
  @Expose() updatedAt: string;
}
