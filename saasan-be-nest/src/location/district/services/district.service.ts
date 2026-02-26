import { HttpStatus, Injectable } from '@nestjs/common';
import { GlobalHttpException } from 'src/common/exceptions/global-http.exception';
import { DistrictRepository } from '../repositories/district.repository';
import { CreateDistrictDto } from '../dtos/create-district.dto';
import { ProvinceIdDto } from 'src/location/province/dtos/province-id.dto';
import { DistrictIdDto } from '../dtos/district-id.dto';
import { ResponseHelper } from 'src/common/helpers/response.helper';
import { DistrictSerializer } from '../serializers/district.serializer';

@Injectable()
export class DistrictService {
  constructor(private readonly districtRepo: DistrictRepository) {}

  async createDistrict(districtData: CreateDistrictDto) {
    const doesDistrictExists = await this.doesDistrictExists({
      name: districtData.name,
    }).lean();
    if (doesDistrictExists) {
      throw new GlobalHttpException(
        'districtAlreadyExistsWithName',
        HttpStatus.AMBIGUOUS,
      );
    }

    this.districtRepo.create(districtData);
  }

  async getDistricts({ page, limit }) {
    const data = await this.districtRepo.find({ page, limit });
    return ResponseHelper.response(
      DistrictSerializer,
      data,
      'Districts fetched successfully',
    );
  }

  async getDistrictsByProvinceId(
    provinceIdDto: ProvinceIdDto,
    { page, limit },
  ) {
    const data = await this.districtRepo.findByProvinceId(provinceIdDto, {
      page,
      limit,
    });
    return ResponseHelper.response(
      DistrictSerializer,
      data,
      'Districts fetched successfully',
    );
  }

  async getDistrictById(districtIdDto: DistrictIdDto) {
    const district = await this.districtRepo.findById(districtIdDto.districtId);
    if (!district) {
      throw new GlobalHttpException('district404', HttpStatus.NOT_FOUND);
    }
    return ResponseHelper.response(
      DistrictSerializer,
      district,
      'District fetched successfully',
    );
  }

  private doesDistrictExists(filter: any) {
    return this.districtRepo.findOne(filter);
  }
}
