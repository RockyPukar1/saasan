import { Expose, Transform } from 'class-transformer';

export class UserSerializer {
  @Expose() @Transform(({ obj }) => obj._id as string) id: string;
  @Expose() email: string;
  @Expose() fullName: string;
  @Expose() role: string;
  @Expose() isActive: boolean;
  @Expose() isVerified: boolean;
  @Expose() provinceId?: string;
  @Expose() districtId?: string;
  @Expose() municipalityId?: string;
  @Expose() wardId?: string;
  @Expose() constituencyId?: string;
  @Expose() lastActiveAt?: string;
  @Expose() createdAt: string;
  @Expose() updatedAt: string;
}
