import { Expose, Transform, Type } from 'class-transformer';
import { ProvinceSerializer } from 'src/location/province/serializers/province.serializer';
import { DistrictSerializer } from 'src/location/district/serializers/district.serializer';
import { MunicipalitySerializer } from 'src/location/municipality/serializers/municipality.serializer';
import { ConstituencySerializer } from 'src/location/constituency/serializers/constituency.serializer';

export class WardSerializer {
  @Expose() @Transform(({ obj }) => obj._id as string) id: string;
  @Expose() wardNumber: string;
  @Expose({ name: 'provinceId' })
  @Type(() => ProvinceSerializer)
  province: ProvinceSerializer;
  @Expose({ name: 'districtId' })
  @Type(() => DistrictSerializer)
  district: DistrictSerializer;
  @Expose({ name: 'municipalityId' })
  @Type(() => MunicipalitySerializer)
  municipality: MunicipalitySerializer;
  @Expose({ name: 'constituencyId' })
  @Type(() => ConstituencySerializer)
  constituency: ConstituencySerializer;

  @Expose() createdAt: string;
  @Expose() updatedAt: string;
}
