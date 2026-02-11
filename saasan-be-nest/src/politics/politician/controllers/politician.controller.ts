import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { UpdatePoliticianDto } from '../dtos/update-politician.dto';
import { PoliticianIdDto } from '../dtos/politician-id.dto';
import { PoliticianService } from '../services/politician.service';
import { CreatePoliticianDto } from '../dtos/create-politician.dto';
import { PoliticianFilterDto } from '../dtos/politician-filter.dto';
import { LevelNameDto } from 'src/politics/level/dtos/level-name.dto';

@Controller('politician')
export class PoliticianController {
  constructor(private readonly politicianService: PoliticianService) {}

  @Post()
  async getAll(@Body() politicianFilterDto: PoliticianFilterDto) {
    return await this.politicianService.getAll(politicianFilterDto);
  }

  @Get(':politicianId')
  async getById(@Param() politicianIdDto: PoliticianIdDto) {
    return await this.politicianService.getById(politicianIdDto);
  }

  @HttpCode(201)
  @Post()
  async create(@Body() politicianData: CreatePoliticianDto) {
    return await this.politicianService.create(politicianData);
  }

  @Put(':politicianId')
  async update(
    @Body() politicianData: UpdatePoliticianDto,
    @Param() { politicianId }: PoliticianIdDto,
  ) {
    return await this.politicianService.update(politicianId, politicianData);
  }

  @HttpCode(204)
  @Delete(':politicianId')
  async delete(@Param() { politicianId }: PoliticianIdDto) {
    return await this.politicianService.delete(politicianId);
  }

  @Get('level/:levelName')
  async getByLevel(@Param() param: LevelNameDto) {
    return await this.politicianService.getByLevel(param);
  }
}
