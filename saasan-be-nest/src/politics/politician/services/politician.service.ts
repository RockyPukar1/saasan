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
import { PoliticianAccountRepository } from '../repositories/politician-account.repository';
import { AuthHelper } from 'src/common/helpers/auth.helper';
import { EmailTemplateFactory } from 'src/common/email/templates/template.factory';
import { EmailService } from 'src/common/email/services/email.service';

@Injectable()
export class PoliticianService {
  constructor(
    private readonly politicianRepo: PoliticianRepository,
    private readonly politicianAccountRepo: PoliticianAccountRepository,
    private readonly emailService: EmailService,
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

    const randomPassword = generateRandomPassword();
    const hashedPassword = await bcrypt.hash(randomPassword, PASSWORD_SALT);

    const politician = await this.politicianAccountRepo.create({
      politicianId,
      password: hashedPassword,
      accountCreatedAt: new Date(),
    });

    const accessToken = AuthHelper.generateToken(politician);
    const refreshToken = AuthHelper.generateRefreshToken({
      userId: politician._id.toString(),
    });
    const email = doesPoliticianExists.contact.email;

    if (email) {
      const emailTemplate = EmailTemplateFactory.createPoliticianAccountEmail({
        politicianName: doesPoliticianExists.fullName,
        email: email,
        password: randomPassword,
      });
      await this.emailService.sendEmail({
        to: email,
        subject: emailTemplate.subject,
        html: emailTemplate.html,
      });
    }

    return ResponseHelper.success(
      {
        politician,
        accessToken,
        refreshToken,
      },
      'Politician account created successfully',
    );
  }

  private doesPoliticianExists(filter: any) {
    return this.politicianRepo.findOne(filter);
  }
}
