import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ProvinceEntity } from '../province/entities/province.entity';
import { ProvinceRepository } from '../province/repositories/province.repository';
import { DistrictRepository } from '../district/repositories/district.repository';
import { ConstituencyRepository } from '../constituency/repositories/constituency.repository';
import { MunicipalityRepository } from '../municipality/repositories/municipality.repository';
import { WardRepository } from '../ward/repositories/ward.repository';
import { PoliticianRepository } from 'src/politics/politician/repositories/politician.repository';
import { PoliticianIdDto } from 'src/politics/politician/dtos/politician-id.dto';
import { GlobalHttpException } from 'src/common/exceptions/global-http.exception';
import { JurisdictionDto } from 'src/message/dtos/create-message.dto';

type JurisdictionLevel =
  | 'federal'
  | 'province'
  | 'district'
  | 'constituency'
  | 'municipality'
  | 'ward';

export interface PoliticianJurisdiction {
  politicianId: string;
  jurisdiction: JurisdictionDto;
  accessibleAreas: Array<{
    _id: string;
    name: string;
    type: 'province' | 'district' | 'constituency' | 'municipality' | 'ward';
  }>;
  jurisdictionLevel: JurisdictionLevel;
}

@Injectable()
export class JurisdictionService {
  constructor(
    @InjectModel(ProvinceEntity.name)
    private readonly provinceRepo: ProvinceRepository,
    private readonly districtRepo: DistrictRepository,
    private readonly constituencyRepo: ConstituencyRepository,
    private readonly municipalityRepo: MunicipalityRepository,
    private readonly wardRepo: WardRepository,
    private readonly politicianRepo: PoliticianRepository,
  ) {}

  async getPoliticianJurisdiction(politicianIdDto: PoliticianIdDto) {
    const politician =
      await this.politicianRepo.findByIdWithRelations(politicianIdDto);

    if (!politician)
      throw new GlobalHttpException('politician404', HttpStatus.NOT_FOUND);

    const jurisdictionLevel = await this.getJurisdictionLevel(
      politician.positionIds || [],
    );
    const jurisdiction = await this.buildJurisdictionHierarchy(
      politician,
      jurisdictionLevel,
    );
    const accessibleAreas = await this.getAccessibleAreas(
      jurisdiction,
      jurisdictionLevel,
    );

    return {
      politicianId: politician._id.toString(),
      jurisdiction,
      accessibleAreas,
      jurisdictionLevel,
    };
  }

  async isWithinJurisdiction(
    politicianJurisdiction: PoliticianJurisdiction,
    targetJurisdiction: JurisdictionDto,
  ) {
    const { jurisdiction, jurisdictionLevel } = politicianJurisdiction;

    switch (jurisdictionLevel) {
      case 'ward':
        return this.checkWardAccess(jurisdiction, targetJurisdiction);
      case 'municipality':
        return this.checkMunicipalityAccess(jurisdiction, targetJurisdiction);
      case 'constituency':
        return this.checkConstituencyAccess(jurisdiction, targetJurisdiction);
      case 'district':
        return this.checkDistrictAccess(jurisdiction, targetJurisdiction);
      case 'province':
        return this.checkProvinceAccess(jurisdiction, targetJurisdiction);
      case 'federal':
        return true;
      default:
        return false;
    }
  }

  async validateJurisdictionAccess(
    politicianIdDto: PoliticianIdDto,
    targetJurisdiction: JurisdictionDto,
  ) {
    const politicianJurisdiction =
      await this.getPoliticianJurisdiction(politicianIdDto);
    return this.isWithinJurisdiction(
      politicianJurisdiction,
      targetJurisdiction,
    );
  }

  async getAccessibleLocations(politicianIdDto: PoliticianIdDto) {
    const politicianJurisdiction =
      await this.getPoliticianJurisdiction(politicianIdDto);
    return politicianJurisdiction.accessibleAreas;
  }

  async filterByJurisdiction<T>(
    items: T[],
    getJuridiction: (item: T) => JurisdictionDto,
    politicianIdDto: PoliticianIdDto,
  ) {
    const politicianJurisdiction =
      await this.getPoliticianJurisdiction(politicianIdDto);

    return items.filter((item) => {
      const itemJurisdiction = getJuridiction(item);
      return this.isWithinJurisdiction(
        politicianJurisdiction,
        itemJurisdiction,
      );
    });
  }

  private async getJurisdictionLevel(
    positionsIds: string[],
  ): Promise<JurisdictionLevel> {
    if (!positionsIds || positionsIds.length === 0) {
      return 'constituency';
    }

    // TODO: this would typically query the position entities
    // For now, using a simplified approach
    const positionLevels = {
      'ward-chair': 'ward',
      mayor: 'municipality',
      'deputy-mayor': 'municipality',
      'district-chief': 'district',
      'province-chief': 'province',
      'member-parliament': 'constituency',
      'prime-minister': 'federal',
      president: 'federal',
    };

    // TODO: in reality, this would query position entities
    return 'constituency';
  }

  private async buildJurisdictionHierarchy(
    politician: any,
    jurisdictionLevel: string,
  ) {
    const hierarchy: JurisdictionDto = {};

    if (politician.constituencyId) {
      const constituency = await this.constituencyRepo.findById(
        politician.constituencyId,
      );
      if (constituency) {
        hierarchy.constituencyId = constituency._id.toString();
        hierarchy.districtId = constituency.districtId.toString();

        const district = await this.districtRepo.findById(
          constituency.districtId.toString(),
        );
        if (district) {
          hierarchy.provinceId = district.provinceId.toString();
        }
      }
    }
    return hierarchy;
  }

  private async getAccessibleAreas(
    jurisdiction: JurisdictionDto,
    jurisdictionLevel: JurisdictionLevel,
  ) {
    const accessibleAreas: any[] = [];

    switch (jurisdictionLevel) {
      case 'ward':
        if (jurisdiction.wardId) {
          const ward = await this.wardRepo.findById(
            jurisdiction.wardId.toString(),
          );
          if (ward) accessibleAreas.push(ward);
        }
        break;

      case 'municipality':
        if (jurisdiction.municipalityId) {
          const municipality = await this.municipalityRepo.findById(
            jurisdiction.municipalityId.toString(),
          );
          if (municipality) accessibleAreas.push(municipality);
          // Add all wards in this municipality
          const wards = await this.wardRepo.findByMunicipalityId(
            { municipalityId: jurisdiction.municipalityId.toString() },
            { page: 1, limit: 1000 },
          );
          accessibleAreas.push(...wards.data);
        }
        break;

      case 'district':
        if (jurisdiction.districtId) {
          const district = await this.districtRepo.findById(
            jurisdiction.districtId.toString(),
          );
          if (district) {
            accessibleAreas.push(district);
            // Add all municipalities and constituencies in this district
            const municipalities = await this.municipalityRepo.findByDistrictId(
              { districtId: jurisdiction.districtId.toString() },
              { page: 1, limit: 1000 },
            );

            const constituencies = await this.constituencyRepo.findByDistrictId(
              { districtId: jurisdiction.districtId.toString() },
              { page: 1, limit: 1000 },
            );
            accessibleAreas.push(
              ...municipalities.data,
              ...constituencies.data,
            );
          }
        }
        break;

      case 'province':
        if (jurisdiction.provinceId) {
          const province = await this.provinceRepo.findById(
            jurisdiction.provinceId.toString(),
          );
          if (province) {
            accessibleAreas.push(province);
            // Add all districts in this province
            const districts = await this.districtRepo.findByProvinceId(
              { provinceId: jurisdiction.provinceId.toString() },
              { page: 1, limit: 1000 },
            );
            accessibleAreas.push(...districts.data);
          }
        }
        break;

      case 'constituency':
        if (jurisdiction.constituencyId) {
          const constituency = await this.constituencyRepo.findById(
            jurisdiction.constituencyId.toString(),
          );
          if (constituency) accessibleAreas.push(constituency);
        }
        break;

      case 'federal':
        // Add all provinces for federal level
        const provinces = await this.provinceRepo.find({
          page: 1,
          limit: 1000,
        });
        accessibleAreas.push(...provinces.data);
        break;
    }

    return accessibleAreas;
  }

  private checkWardAccess(
    jurisdiction: JurisdictionDto,
    targetJurisdiction: JurisdictionDto,
  ) {
    return (
      jurisdiction.wardId?.toString === targetJurisdiction.wardId?.toString()
    );
  }

  private checkMunicipalityAccess(
    jurisdiction: JurisdictionDto,
    targetJurisdiction: JurisdictionDto,
  ) {
    return (
      jurisdiction.municipalityId?.toString ===
      targetJurisdiction.municipalityId?.toString
    );
  }

  private checkDistrictAccess(
    jurisdiction: JurisdictionDto,
    targetJurisdiction: JurisdictionDto,
  ) {
    return (
      jurisdiction.districtId?.toString ===
      targetJurisdiction.districtId?.toString
    );
  }

  private checkProvinceAccess(
    jurisdiction: JurisdictionDto,
    targetJurisdiction: JurisdictionDto,
  ) {
    return (
      jurisdiction.provinceId?.toString ===
      targetJurisdiction.provinceId?.toString
    );
  }

  private checkConstituencyAccess(
    jurisdiction: JurisdictionDto,
    targetJurisdiction: JurisdictionDto,
  ) {
    return (
      jurisdiction.constituencyId?.toString ===
      targetJurisdiction.constituencyId?.toString
    );
  }
}
