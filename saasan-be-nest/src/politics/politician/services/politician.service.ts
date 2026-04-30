import { HttpStatus, Injectable } from '@nestjs/common';
import bcrypt from 'bcryptjs';
import { Types } from 'mongoose';
import { RedisCacheService } from 'src/common/cache/services/redis-cache.service';
import { EMAIL_EVENT_TYPES } from 'src/common/email/events/email.events';
import { EmailPublisher } from 'src/common/email/publishers/email.publisher';
import { GlobalHttpException } from 'src/common/exceptions/global-http.exception';
import { generateRandomPassword } from 'src/common/helpers/generate-password.helper';
import { ResponseHelper } from 'src/common/helpers/response.helper';
import { UserRole, PASSWORD_SALT } from 'src/user/entities/user.entity';
import { UserRepository } from 'src/user/repositories/user.repository';
import { UserSerializer } from 'src/user/serializers/user.serializer';
import { LevelNameDto } from 'src/politics/level/dtos/level-name.dto';
import { CreatePoliticianDto } from '../dtos/create-politician.dto';
import { PoliticianAnnouncementIdDto } from '../dtos/politician-announcement-id.dto';
import { PoliticianFilterDto } from '../dtos/politician-filter.dto';
import { PoliticianIdDto } from '../dtos/politician-id.dto';
import { PoliticianPromiseIdDto } from '../dtos/politician-promise-id.dto';
import { UpdatePoliticianDto } from '../dtos/update-politician.dto';
import { UpsertPoliticianAnnouncementDto } from '../dtos/upsert-politician-announcement.dto';
import { UpsertPoliticianPromiseDto } from '../dtos/upsert-politician-promise.dto';
import { PoliticianRepository } from '../repositories/politician.repository';
import {
  AnnouncementSerializer,
  PoliticianSerializer,
  PromiseSerializer,
} from '../serializers/politician.serializer';

@Injectable()
export class PoliticianService {
  constructor(
    private readonly politicianRepo: PoliticianRepository,
    private readonly emailPublisher: EmailPublisher,
    private readonly userRepo: UserRepository,
    private readonly redisCache: RedisCacheService,
  ) {}

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

  async getByPartyId(partyId: string) {
    const politicians = await this.politicianRepo.getByPartyId(partyId);
    return ResponseHelper.success(politicians);
  }

  async getOwnPromises(userId: string) {
    const politician = await this.getPoliticianForUser(userId);
    const promises = await this.politicianRepo.getPromisesByPoliticianId(
      politician._id.toString(),
    );

    return ResponseHelper.response(
      PromiseSerializer,
      promises,
      'Promises fetched successfully',
    );
  }

  async createOwnPromise(userId: string, promiseData: UpsertPoliticianPromiseDto) {
    const politician = await this.getPoliticianForUser(userId);
    const createdPromise = await this.politicianRepo.addPromise(
      politician._id.toString(),
      this.normalizePromiseData(promiseData),
    );

    return ResponseHelper.response(
      PromiseSerializer,
      createdPromise,
      'Promise created successfully',
    );
  }

  async updateOwnPromise(
    userId: string,
    { promiseId }: PoliticianPromiseIdDto,
    promiseData: UpsertPoliticianPromiseDto,
  ) {
    const politician = await this.getPoliticianForUser(userId);
    const updatedPromise = await this.politicianRepo.updatePromise(
      politician._id.toString(),
      promiseId,
      this.normalizePromiseData(promiseData),
    );

    if (!updatedPromise) {
      throw new GlobalHttpException('politician404', HttpStatus.NOT_FOUND);
    }

    return ResponseHelper.response(
      PromiseSerializer,
      updatedPromise,
      'Promise updated successfully',
    );
  }

  async deleteOwnPromise(userId: string, { promiseId }: PoliticianPromiseIdDto) {
    const politician = await this.getPoliticianForUser(userId);
    await this.politicianRepo.deletePromise(politician._id.toString(), promiseId);
  }

  async getOwnAnnouncements(userId: string) {
    const politician = await this.getPoliticianForUser(userId);
    const announcements =
      await this.politicianRepo.getAnnouncementsByPoliticianId(
        politician._id.toString(),
      );

    return ResponseHelper.response(
      AnnouncementSerializer,
      announcements,
      'Announcements fetched successfully',
    );
  }

  async createOwnAnnouncement(
    userId: string,
    announcementData: UpsertPoliticianAnnouncementDto,
  ) {
    const politician = await this.getPoliticianForUser(userId);
    const createdAnnouncement = await this.politicianRepo.createAnnouncement(
      politician._id.toString(),
      politician._id.toString(),
      this.normalizeAnnouncementData(announcementData),
    );

    return ResponseHelper.response(
      AnnouncementSerializer,
      createdAnnouncement,
      'Announcement created successfully',
    );
  }

  async updateOwnAnnouncement(
    userId: string,
    { announcementId }: PoliticianAnnouncementIdDto,
    announcementData: UpsertPoliticianAnnouncementDto,
  ) {
    const politician = await this.getPoliticianForUser(userId);
    const updatedAnnouncement = await this.politicianRepo.updateAnnouncement(
      politician._id.toString(),
      announcementId,
      this.normalizeAnnouncementData(announcementData),
    );

    if (!updatedAnnouncement) {
      throw new GlobalHttpException('politician404', HttpStatus.NOT_FOUND);
    }

    return ResponseHelper.response(
      AnnouncementSerializer,
      updatedAnnouncement,
      'Announcement updated successfully',
    );
  }

  async deleteOwnAnnouncement(
    userId: string,
    { announcementId }: PoliticianAnnouncementIdDto,
  ) {
    const politician = await this.getPoliticianForUser(userId);
    await this.politicianRepo.deleteAnnouncement(
      politician._id.toString(),
      announcementId,
    );
  }

  async getAchievements() {}

  async getContacts() {}

  async getSocialMedia() {}

  async getBudgetTracking() {}

  async getAttendance() {}

  async getRatings() {}

  async ratePolitician() {}

  async createAccount({ politicianId }: PoliticianIdDto) {
    const doesPoliticianExists = await this.doesPoliticianExists({
      _id: new Types.ObjectId(politicianId),
    }).lean();
    if (!doesPoliticianExists) {
      throw new GlobalHttpException('politician404', HttpStatus.NOT_FOUND);
    }

    const email = doesPoliticianExists.contact?.email?.trim().toLowerCase();

    if (!email) {
      throw new Error(
        'Politician must have an email before creating an account',
      );
    }

    const existingUserByEmail = await this.userRepo.findOne({ email });

    if (doesPoliticianExists.userId) {
      throw new GlobalHttpException(
        'userAlreadyExistsWithEmail',
        HttpStatus.AMBIGUOUS,
      );
    }

    if (existingUserByEmail) {
      throw new GlobalHttpException(
        'userAlreadyExistsWithEmail',
        HttpStatus.AMBIGUOUS,
      );
    }

    const randomPassword = generateRandomPassword();
    const hashedPassword = await bcrypt.hash(randomPassword, PASSWORD_SALT);

    const user = await this.userRepo.create({
      email,
      password: hashedPassword,
      role: UserRole.POLITICIAN,
      isVerified: true,
    });

    await this.politicianRepo.findByIdAndUpdate(politicianId, {
      userId: user._id,
    });

    await this.redisCache.del('users:*');

    if (email) {
      await this.emailPublisher.publishPoliticianAccountCreated({
        jobKey: `email:politician-account-created:${user._id.toString()}`,
        type: EMAIL_EVENT_TYPES.POLITICIAN_ACCOUNT_CREATED,
        to: email,
        politicianName: doesPoliticianExists.fullName,
        password: randomPassword,
        retryCount: 0,
      });
    }

    return ResponseHelper.success(
      {
        user: UserSerializer.toPayload(
          { ...user.toObject(), politicianId },
          doesPoliticianExists,
        ),
      },
      'Politician account created successfully',
    );
  }

  private doesPoliticianExists(filter: any) {
    return this.politicianRepo.findOne(filter);
  }

  private async getPoliticianForUser(userId: string) {
    const politician = await this.politicianRepo.findByUserId(userId);
    if (!politician) {
      throw new GlobalHttpException('politician404', HttpStatus.NOT_FOUND);
    }

    return politician;
  }

  private normalizePromiseData(promiseData: UpsertPoliticianPromiseDto) {
    return {
      title: promiseData.title,
      description: promiseData.description,
      status: promiseData.status,
      dueDate: new Date(promiseData.dueDate),
      progress: promiseData.progress,
    };
  }

  private normalizeAnnouncementData(
    announcementData: UpsertPoliticianAnnouncementDto,
  ) {
    const scheduledAt = announcementData.scheduledAt
      ? new Date(announcementData.scheduledAt)
      : null;
    const shouldPublishNow =
      !scheduledAt || scheduledAt.getTime() <= Date.now();

    return {
      title: announcementData.title,
      content: announcementData.content,
      type: announcementData.type,
      priority: announcementData.priority,
      isPublic: announcementData.isPublic ?? true,
      scheduledAt,
      publishedAt: shouldPublishNow ? new Date() : null,
    };
  }
}
