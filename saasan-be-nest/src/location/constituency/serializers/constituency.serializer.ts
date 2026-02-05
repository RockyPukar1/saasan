import { Expose, Transform, Type } from 'class-transformer';

export class ConstituencySerializer {
  @Expose() @Transform(({ obj }) => obj._id as string) id: string;
  @Expose() constituencyNumber: string;
  @Expose() provinceId: string;
  @Expose() districtId: string;

  @Expose() createdAt: string;
  @Expose() updatedAt: string;
}
