import { Expose, Transform, Type } from 'class-transformer';

export class ProvinceSerializer {
  @Expose() @Transform(({ obj }) => obj._id as string) id: string;
  @Expose() name: string;
  @Expose() provinceNumber: string;
  @Expose() capital: string;

  @Expose() createdAt: string;
  @Expose() updatedAt: string;
}
