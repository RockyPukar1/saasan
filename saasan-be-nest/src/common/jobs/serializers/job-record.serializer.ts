import { Expose, Transform } from 'class-transformer';

export class JobRecordSerializer {
  @Expose()
  @Transform(({ obj }) => obj._id?.toString?.() || obj.id)
  id: string;

  @Expose() jobKey: string;
  @Expose() topic: string;
  @Expose() jobType: string;
  @Expose() status: string;
  @Expose() attempts: number;
  @Expose() maxAttempts: number;
  @Expose() nextRetryAt?: Date | null;
  @Expose() processingStartedAt?: Date | null;
  @Expose() completedAt?: Date | null;
  @Expose() deadLetteredAt?: Date | null;
  @Expose() lastError?: string | null;
  @Expose() payload: Record<string, unknown>;
  @Expose() createdAt: Date;
  @Expose() updatedAt: Date;
}
