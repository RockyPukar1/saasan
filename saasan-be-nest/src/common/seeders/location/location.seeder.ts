import { Injectable } from '@nestjs/common';

import locationData from './data/location.json';
import { InjectModel } from '@nestjs/mongoose';
import {
  ProvinceEntity,
  ProvinceEntityDocument,
} from 'src/location/province/entities/province.entity';
import { Model } from 'mongoose';
import {
  DistrictEntity,
  DistrictEntityDocument,
} from 'src/location/district/entities/district.entity';
import {
  ConstituencyEntity,
  ConstituencyEntityDocument,
} from 'src/location/constituency/entities/constituency.entity';
import {
  MunicipalityEntity,
  MunicipalityEntityDocument,
} from 'src/location/municipality/entities/municipality.entity';
import {
  WardEntity,
  WardEntityDocument,
} from 'src/location/ward/entities/ward.entity';

@Injectable()
export class LocationSeeder {
  constructor(
    @InjectModel(ProvinceEntity.name)
    private readonly provinceModel: Model<ProvinceEntityDocument>,
    @InjectModel(DistrictEntity.name)
    private readonly districtModel: Model<DistrictEntityDocument>,
    @InjectModel(ConstituencyEntity.name)
    private readonly constituencyModel: Model<ConstituencyEntityDocument>,
    @InjectModel(MunicipalityEntity.name)
    private readonly municipalityModel: Model<MunicipalityEntityDocument>,
    @InjectModel(WardEntity.name)
    private readonly wardModel: Model<WardEntityDocument>,
  ) {}

  async seed() {
    console.log('Seeding location...');

    for (const province of locationData) {
      const provinceDoc = await this.provinceModel.findOneAndUpdate(
        { provinceNumber: province.provinceNumber },
        {
          $setOnInsert: {
            name: province.name,
            capital: province.capital,
          },
        },
        { upsert: true, new: true },
      );

      if (!province?.districts?.length) continue;

      const provinceId = provinceDoc._id;
      const districts = province.districts;

      for (const district of districts) {
        const districtDoc = await this.districtModel.findOneAndUpdate(
          { name: district.name, provinceId },
          {
            $setOnInsert: {
              headquarter: district.headquarter,
            },
          },
          { upsert: true, new: true },
        );

        const districtId = districtDoc._id;

        if (district?.constituencies?.length) {
          const constituencies = district.constituencies;
          for (const constituency of constituencies) {
            await this.constituencyModel.findOneAndUpdate(
              {
                constituencyNumber: constituency.constituencyNumber,
                provinceId,
                districtId,
              },
              {
                $setOnInsert: {
                  constituencyNumber: constituency.constituencyNumber,
                  provinceId,
                  districtId,
                },
              },
              { upsert: true, new: true },
            );
          }
        }

        if (!district?.municipalities?.length) continue;

        const municipalities = district.municipalities;

        if (district?.municipalities?.length) {
          for (const municipality of municipalities) {
            const municipalityDoc =
              await this.municipalityModel.findOneAndUpdate(
                { name: municipality.name, provinceId, districtId },
                {
                  $setOnInsert: {
                    name: municipality.name,
                    provinceId,
                    districtId,
                  },
                },
                { upsert: true, new: true },
              );

            if (!municipality?.wards?.length) continue;

            const municipalityId = municipalityDoc._id;
            const wards = municipality.wards;

            for (const ward of wards) {
              await this.wardModel.findOneAndUpdate(
                {
                  wardNumber: ward.wardNumber,
                  municipalityId,
                },
                {
                  $setOnInsert: {
                    wardNumber: ward.wardNumber,
                    provinceId,
                    districtId,
                    municipalityId,
                  },
                },
                { upsert: true, new: true },
              );
            }
          }
        }
      }
    }

    console.log('Location seeded successfully');
  }
}
