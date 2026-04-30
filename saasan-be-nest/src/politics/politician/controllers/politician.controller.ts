import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { PERMISSIONS } from 'src/common/constants/permission.constants';
import { HttpAccessTokenGuard } from 'src/common/guards/http-access-token.guard';
import { PermissionGuard } from 'src/common/guards/permission.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { UserRole } from 'src/user/entities/user.entity';
import type { Request } from 'express';
import { UpdatePoliticianDto } from '../dtos/update-politician.dto';
import { PoliticianAnnouncementIdDto } from '../dtos/politician-announcement-id.dto';
import { PoliticianIdDto } from '../dtos/politician-id.dto';
import { PoliticianPromiseIdDto } from '../dtos/politician-promise-id.dto';
import { PoliticianService } from '../services/politician.service';
import { CreatePoliticianDto } from '../dtos/create-politician.dto';
import { PoliticianFilterDto } from '../dtos/politician-filter.dto';
import { LevelNameDto } from 'src/politics/level/dtos/level-name.dto';
import { UpsertPoliticianAnnouncementDto } from '../dtos/upsert-politician-announcement.dto';
import { UpsertPoliticianPromiseDto } from '../dtos/upsert-politician-promise.dto';

@Controller('politician')
export class PoliticianController {
  constructor(private readonly politicianService: PoliticianService) {}

  @Post()
  async create(@Body() politicianData: CreatePoliticianDto) {
    return await this.politicianService.create(politicianData);
  }

  @Post('filter')
  async getAll(@Body() politicianFilterDto: PoliticianFilterDto) {
    return await this.politicianService.getAll(politicianFilterDto);
  }

  @Get(':politicianId')
  async getById(@Param() politicianIdDto: PoliticianIdDto) {
    return await this.politicianService.getById(politicianIdDto);
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

  @Get()
  async getByPartyId(@Query('partyId') partyId: string) {
    return await this.politicianService.getByPartyId(partyId);
  }
}

@UseGuards(HttpAccessTokenGuard, RoleGuard, PermissionGuard)
@Roles(UserRole.POLITICIAN)
@Controller('politician/portal')
export class PoliticianPortalController {
  constructor(private readonly politicianService: PoliticianService) {}

  @Permissions(PERMISSIONS.promises.view)
  @Get('promises')
  async getOwnPromises(@Req() req: Request) {
    return this.politicianService.getOwnPromises(req.user.id);
  }

  @Permissions(PERMISSIONS.promises.create)
  @HttpCode(HttpStatus.CREATED)
  @Post('promises')
  async createOwnPromise(
    @Req() req: Request,
    @Body() promiseData: UpsertPoliticianPromiseDto,
  ) {
    return this.politicianService.createOwnPromise(req.user.id, promiseData);
  }

  @Permissions(PERMISSIONS.promises.update)
  @Put('promises/:promiseId')
  async updateOwnPromise(
    @Req() req: Request,
    @Param() promiseIdDto: PoliticianPromiseIdDto,
    @Body() promiseData: UpsertPoliticianPromiseDto,
  ) {
    return this.politicianService.updateOwnPromise(
      req.user.id,
      promiseIdDto,
      promiseData,
    );
  }

  @Permissions(PERMISSIONS.promises.delete)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('promises/:promiseId')
  async deleteOwnPromise(
    @Req() req: Request,
    @Param() promiseIdDto: PoliticianPromiseIdDto,
  ) {
    await this.politicianService.deleteOwnPromise(req.user.id, promiseIdDto);
  }

  @Permissions(PERMISSIONS.announcements.view)
  @Get('announcements')
  async getOwnAnnouncements(@Req() req: Request) {
    return this.politicianService.getOwnAnnouncements(req.user.id);
  }

  @Permissions(PERMISSIONS.announcements.create)
  @HttpCode(HttpStatus.CREATED)
  @Post('announcements')
  async createOwnAnnouncement(
    @Req() req: Request,
    @Body() announcementData: UpsertPoliticianAnnouncementDto,
  ) {
    return this.politicianService.createOwnAnnouncement(
      req.user.id,
      announcementData,
    );
  }

  @Permissions(PERMISSIONS.announcements.update)
  @Put('announcements/:announcementId')
  async updateOwnAnnouncement(
    @Req() req: Request,
    @Param() announcementIdDto: PoliticianAnnouncementIdDto,
    @Body() announcementData: UpsertPoliticianAnnouncementDto,
  ) {
    return this.politicianService.updateOwnAnnouncement(
      req.user.id,
      announcementIdDto,
      announcementData,
    );
  }

  @Permissions(PERMISSIONS.announcements.delete)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('announcements/:announcementId')
  async deleteOwnAnnouncement(
    @Req() req: Request,
    @Param() announcementIdDto: PoliticianAnnouncementIdDto,
  ) {
    await this.politicianService.deleteOwnAnnouncement(
      req.user.id,
      announcementIdDto,
    );
  }
}
