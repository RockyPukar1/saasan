import { HttpStatus, Injectable } from '@nestjs/common';
import { CreatePoliticianDto } from '../dtos/create-politician.dto';
import { GlobalHttpException } from 'src/common/exceptions/global-http.exception';
import { Types } from 'mongoose';
import { PoliticianRepository } from '../repositories/politician.repository';
import { ResponseHelper } from 'src/common/helpers/response.helper';
import { PoliticianFilterDto } from '../dtos/politician-filter.dto';
import { PoliticianSerializer } from '../serializers/politician.serializer';
import { PoliticianIdDto } from '../dtos/politician-id.dto';
import { LevelNameDto } from 'src/politics/level/dtos/level-name.dto';

@Injectable()
export class PoliticianService {
  constructor(private readonly politicianRepo: PoliticianRepository) {}

  async getAll(politicianFilterDto: PoliticianFilterDto) {
    const politicians = await this.politicianRepo.getAll(politicianFilterDto);
    return ResponseHelper.response(
      PoliticianSerializer,
      politicians,
      'Politicians fetched successfully',
    );
  }

  async getById(politicianIdDto: PoliticianIdDto) {
    const politician = await this.politicianRepo.findById(politicianIdDto);
    return ResponseHelper.response(
      PoliticianSerializer,
      politician,
      'Politician fetched successfully',
    );
  }

  async create(politicianData: CreatePoliticianDto) {
    await this.politicianRepo.create(politicianData);
  }

  async update(politicianId: string, politicianData: CreatePoliticianDto) {
    const politician = await this.doesPoliticianExists({
      _id: new Types.ObjectId(politicianId),
    }).lean();
    if (!politician)
      throw new GlobalHttpException('politician404', HttpStatus.NOT_FOUND);

    return await this.politicianRepo.findByIdAndUpdate(
      politicianId,
      politicianData,
    );
  }

  async delete(politicianId: string) {
    const politician = await this.doesPoliticianExists({
      _id: new Types.ObjectId(politicianId),
    });
    if (!politician)
      throw new GlobalHttpException('politician404', HttpStatus.NOT_FOUND);

    return await this.politicianRepo.findByIdAndDelete(politicianId);
  }

  async getByLevel(query: LevelNameDto) {
    const politicians = await this.politicianRepo.getByLevel(query);
    return ResponseHelper.success(politicians);
  }

  async getPromises() {}

  async getAchievements() {}

  async getContacts() {}

  async getSocialMedia() {}

  async getBudgetTracking() {}

  async getAttendance() {}

  async getRatings() {}

  async ratePolitician() {}

  private doesPoliticianExists(filter: any) {
    return this.politicianRepo.findOne(filter);
  }
}
