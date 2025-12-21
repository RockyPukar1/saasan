import { Module } from '@nestjs/common';
import { MunicipalityService } from './municipality/services/municipality.service';
import { ConstituencyService } from './constituency/services/constituency.service';
import { WardService } from './ward/services/ward.service';
import { ConstituencyController } from './constituency/controllers/constituency.controller';
import { ProvinceController } from './province/controllers/province.controller';
import { DistrictController } from './district/controllers/district.controller';
import { ProvinceService } from './province/services/province.service';
import { DistrictService } from './district/services/district.service';
import { MunicipalityController } from './municipality/controllers/municipality.controller';
import { WardController } from './ward/controllers/ward.controller';
import { ProvinceRepository } from './province/repositories/province.repository';
import { MunicipalityRepository } from './municipality/repositories/municipality.repository';
import { WardRepository } from './ward/repositories/ward.repository';
import { ConstituencyRepository } from './constituency/repositories/constituency.repository';
import { DistrictRepository } from './district/repositories/district.repository';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ProvinceEntity,
  ProvinceEntitySchema,
} from './province/entities/province.entity';
import {
  DistrictEntity,
  DistrictEntitySchema,
} from './district/entities/district.entity';
import {
  ConstituencyEntity,
  ConstituencyEntitySchema,
} from './constituency/entities/constituency.entity';
import {
  MunicipalityEntity,
  MunicipalityEntitySchema,
} from './municipality/entities/municipality.entity';
import { WardEntity, WardEntitySchema } from './ward/entities/ward.entity';

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
  providers: [
    ProvinceService,
    DistrictService,
    ConstituencyService,
    MunicipalityService,
    WardService,
    DistrictController,
    ProvinceRepository,
    MunicipalityRepository,
    WardRepository,
    ConstituencyRepository,
    DistrictRepository,
  ],
  controllers: [
    ProvinceController,
    DistrictController,
    ConstituencyController,
    MunicipalityController,
    WardController,
  ],
})
export class LocationModule {}
