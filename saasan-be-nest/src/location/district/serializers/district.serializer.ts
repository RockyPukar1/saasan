import { Expose, Transform, Type } from 'class-transformer';
import { ProvinceSerializer } from 'src/location/province/serializers/province.serializer';
export class DistrictSerializer {
  @Expose() @Transform(({ obj }) => obj._id as string) id: string;
  @Expose() name: string;
  @Expose({ name: 'provinceId' })
  @Type(() => ProvinceSerializer)
  province: ProvinceSerializer;
  @Expose() headquarter: string;

  @Expose() createdAt: string;
  @Expose() updatedAt: string;
}
