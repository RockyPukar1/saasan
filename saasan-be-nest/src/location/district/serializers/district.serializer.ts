import { Expose, Transform, Type } from 'class-transformer';

export class DistrictSerializer {
  @Expose() @Transform(({ obj }) => obj._id as string) id: string;
  @Expose() name: string;
  @Expose() provinceId: string;
  @Expose() headquarter: string;

  @Expose() createdAt: string;
  @Expose() updatedAt: string;
}
