import { Expose, Transform, Type } from 'class-transformer';

export class ReportStatusSerializer {
  @Expose() @Transform(({ obj }) => obj._id as string) id: string;
  @Expose() title: string;
  @Expose() description: string;
  @Expose() createdAt: string;
  @Expose() updatedAt: string;
}
