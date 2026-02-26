import { Expose, Transform, Type } from 'class-transformer';
import { DistrictSerializer } from 'src/location/district/serializers/district.serializer';
import { ProvinceSerializer } from 'src/location/province/serializers/province.serializer';

export class ConstituencySerializer {
  @Expose() @Transform(({ obj }) => obj._id as string) id: string;
  @Expose() constituencyNumber: string;
  @Expose({ name: 'provinceId' })
  @Type(() => ProvinceSerializer)
  province: ProvinceSerializer;
  @Expose({ name: 'districtId' })
  @Type(() => DistrictSerializer)
  district: DistrictSerializer;

  @Expose() createdAt: string;
  @Expose() updatedAt: string;
}
