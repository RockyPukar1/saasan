import { Expose, Transform, Type } from 'class-transformer';

export class WardSerializer {
  @Expose() @Transform(({ obj }) => obj._id as string) id: string;
  @Expose() wardNumber: string;
  @Expose() provinceId: string;
  @Expose() districtId: string;
  @Expose() constituencyId: string;
  @Expose() municipalityId: string;

  @Expose() createdAt: string;
  @Expose() updatedAt: string;
}
