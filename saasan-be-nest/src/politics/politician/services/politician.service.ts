import { HttpStatus, Injectable } from '@nestjs/common';
import bcrypt from 'bcryptjs';
import { PASSWORD_SALT } from 'src/user/entities/user.entity';
import { CreatePoliticianDto } from '../dtos/create-politician.dto';
import { GlobalHttpException } from 'src/common/exceptions/global-http.exception';
import { Types } from 'mongoose';
import { PoliticianRepository } from '../repositories/politician.repository';
import { ResponseHelper } from 'src/common/helpers/response.helper';
import { PoliticianFilterDto } from '../dtos/politician-filter.dto';
import { PoliticianSerializer } from '../serializers/politician.serializer';
import { PoliticianIdDto } from '../dtos/politician-id.dto';
import { LevelNameDto } from 'src/politics/level/dtos/level-name.dto';
import { generateRandomPassword } from 'src/common/helpers/generate-password.helper';
import { EmailPublisher } from 'src/common/email/publishers/email.publisher';
import { EMAIL_EVENT_TYPES } from 'src/common/email/events/email.events';
import { UserRepository } from 'src/user/repositories/user.repository';
import { UserRole } from 'src/user/entities/user.entity';
import { RedisCacheService } from 'src/common/cache/services/redis-cache.service';
import { UserSerializer } from 'src/user/serializers/user.serializer';

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

  async getPromises() {}

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
}
