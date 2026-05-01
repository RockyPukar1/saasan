import { Expose, Transform } from 'class-transformer';

export class EventSerializer {
  @Expose()
  @Transform(({ obj }) => obj._id?.toString?.() || obj.id)
  id: string;

  @Expose() date: Date;
  @Expose() title: string;
  @Expose() description: string;
  @Expose() category: string;
  @Expose() significance?: string;
  @Expose() location?: string;
  @Expose() sourceUrl?: string;
  @Expose() isVerified: boolean;

  @Expose()
  @Transform(({ obj }) => new Date(obj.date).getFullYear())
  year: number;

  @Expose() createdAt: Date;
  @Expose() updatedAt: Date;
}
