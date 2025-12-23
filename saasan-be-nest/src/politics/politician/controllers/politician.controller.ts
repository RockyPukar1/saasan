import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { PoliticianService } from '../services/politician.service';
import { CreatePoliticianDto } from '../dtos/create-politician.dto';
import { UpdatePoliticianDto } from '../dtos/update-politician.dto';
import { PoliticianIdDto } from '../dtos/politician-id.dto';

@Controller('politician')
export class PoliticianController {
  constructor(private readonly politicianService: PoliticianService) {}

  @Get()
  async getAll() {
    return this.politicianService.getAll();
  }

  @HttpCode(201)
  @Post()
  async create(@Body() politicianData: CreatePoliticianDto) {
    return await this.politicianService.create(politicianData);
  }

  @Put(':politicianId')
  async update(
    @Body() politicianData: UpdatePoliticianDto,
    @Query() { politicianId }: PoliticianIdDto,
  ) {
    return await this.politicianService.update(politicianId, politicianData);
  }

  @HttpCode(204)
  @Delete(':politicianId')
  async delete(@Query() { politicianId }: PoliticianIdDto) {
    return await this.politicianService.delete(politicianId);
  }

  @Get()
  async getByLevel() {
    return await this.politicianService.getByLevel();
  }

  @Get(':politicianId/detailed')
  async getDetailedProfile() {
    return await this.politicianService.getDetailedProfile();
  }

  @Get(':politicianId/promises')
  async getPromises() {
    return await this.politicianService.getPromises();
  }

  @Get(':politicianId/achievements')
  async getAchievements() {
    return await this.politicianService.getAchievements();
  }

  @Get(':politicianId/contacts')
  async getContacts() {
    return await this.politicianService.getContacts();
  }

  @Get(':politicianId/social-media')
  async getSocialMedia() {
    return await this.politicianService.getSocialMedia();
  }

  @Get(':politicianId/budget')
  async getBudgetTracking() {
    return await this.politicianService.getBudgetTracking();
  }

  @Get(':politicianId/attendance')
  async getAttendance() {
    return await this.politicianService.getAttendance();
  }

  @Get(':politicianId/ratings')
  async getRatings() {
    return await this.politicianService.getRatings();
  }

  @Post(':politicianId/rate')
  async ratePolitician() {
    return await this.politicianService.ratePolitician();
  }
}
