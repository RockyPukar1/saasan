import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ConstituencyEntity,
  ConstituencyEntitySchema,
} from '@/location/constituency/entities/constituency.entity';
import {
  DistrictEntity,
  DistrictEntitySchema,
} from '@/location/district/entities/district.entity';
import {
  MunicipalityEntity,
  MunicipalityEntitySchema,
} from '@/location/municipality/entities/municipality.entity';
import {
  ProvinceEntity,
  ProvinceEntitySchema,
} from '@/location/province/entities/province.entity';
import {
  WardEntity,
  WardEntitySchema,
} from '@/location/ward/entities/ward.entity';
import { LocationSeeder } from './location.seeder';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ProvinceEntity.name, schema: ProvinceEntitySchema },
      { name: DistrictEntity.name, schema: DistrictEntitySchema },
      { name: ConstituencyEntity.name, schema: ConstituencyEntitySchema },
      { name: MunicipalityEntity.name, schema: MunicipalityEntitySchema },
      { name: WardEntity.name, schema: WardEntitySchema },
    ]),
  ],
  providers: [LocationSeeder],
  exports: [LocationSeeder],
})
export class LocationSeederModule {}
