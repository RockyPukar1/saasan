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

type CursorPage<T> = {
  data: T[];
  nextCursor: string | null;
  hasNext: boolean;
};

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

  private async fetchAllCursorPages<T>(
    fetchPage: (cursor?: string) => Promise<CursorPage<T>>,
  ) {
    const allItems: T[] = [];
    let cursor: string | undefined;
    let hasNext = true;

    while (hasNext) {
      const page = await fetchPage(cursor);
      allItems.push(...page.data);
      cursor = page.nextCursor || undefined;
      hasNext = Boolean(page.hasNext && cursor);
    }

    return allItems;
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
          const municipalityId = jurisdiction.municipalityId.toString();
          const municipality = await this.municipalityRepo.findById(
            municipalityId,
          );
          if (municipality) accessibleAreas.push(municipality);
          // Add all wards in this municipality
          const wards = await this.fetchAllCursorPages((cursor) =>
            this.wardRepo.findByMunicipalityId(
              { municipalityId },
              { cursor, limit: 100 },
            ),
          );
          accessibleAreas.push(...wards);
        }
        break;

      case 'district':
        if (jurisdiction.districtId) {
          const districtId = jurisdiction.districtId.toString();
          const district = await this.districtRepo.findById(
            districtId,
          );
          if (district) {
            accessibleAreas.push(district);
            // Add all municipalities and constituencies in this district
            const municipalities = await this.fetchAllCursorPages((cursor) =>
              this.municipalityRepo.findByDistrictId(
                { districtId },
                { cursor, limit: 100 },
              ),
            );

            const constituencies = await this.fetchAllCursorPages((cursor) =>
              this.constituencyRepo.findByDistrictId(
                { districtId },
                { cursor, limit: 100 },
              ),
            );
            accessibleAreas.push(...municipalities, ...constituencies);
          }
        }
        break;

      case 'province':
        if (jurisdiction.provinceId) {
          const provinceId = jurisdiction.provinceId.toString();
          const province = await this.provinceRepo.findById(
            provinceId,
          );
          if (province) {
            accessibleAreas.push(province);
            // Add all districts in this province
            const districts = await this.fetchAllCursorPages((cursor) =>
              this.districtRepo.findByProvinceId(
                { provinceId },
                { cursor, limit: 100 },
              ),
            );
            accessibleAreas.push(...districts);
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
        const provinces = await this.fetchAllCursorPages((cursor) =>
          this.provinceRepo.find({
            cursor,
            limit: 100,
          }),
        );
        accessibleAreas.push(...provinces);
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
