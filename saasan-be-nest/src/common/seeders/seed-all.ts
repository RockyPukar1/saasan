import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { getModelToken } from '@nestjs/mongoose';
import bcrypt from 'bcryptjs';
import { Model, Types } from 'mongoose';
import { AppModule } from '../../app.module';
import { BudgetEntity } from '../../budget/entities/budget.entity';
import { CaseEntity } from '../../case/entities/case.entity';
import { EventEntity } from '../../event/entities/event.entity';
import {
  MessageCategory,
  MessageEntity,
  MessageEntrySenderType,
  MessageStatus,
  MessageUrgency,
} from '../../message/entities/message.entity';
import { ConstituencyEntity } from '../../location/constituency/entities/constituency.entity';
import { DistrictEntity } from '../../location/district/entities/district.entity';
import { MunicipalityEntity } from '../../location/municipality/entities/municipality.entity';
import { ProvinceEntity } from '../../location/province/entities/province.entity';
import { WardEntity } from '../../location/ward/entities/ward.entity';
import { PartyEntity } from '../../politics/party/entities/party.entity';
import { LevelEntity } from '../../politics/level/entities/level.entity';
import { PoliticianEntity } from '../../politics/politician/entities/politician.entity';
import { PositionEntity } from '../../politics/position/entities/position.entity';
import { PollOptionEntity } from '../../poll/entities/poll-option.entity';
import { PollVoteEntity } from '../../poll/entities/poll-vote.entity';
import { PollEntity } from '../../poll/entities/poll.entity';
import { ReportEntity } from '../../report/entities/report.entity';
import {
  PASSWORD_SALT,
  UserEntity,
  UserRole,
} from '../../user/entities/user.entity';
import { CitizenEntity } from '../../user/entities/citizen.entity';
import { AdminEntity } from '../../user/entities/admin.entity';

const logger = new Logger('SeedAll');
const SEEDED_DOMAIN = 'seed.saasan.local';

type LocationBundle = {
  provinceId: Types.ObjectId;
  districtId: Types.ObjectId;
  constituencyId?: Types.ObjectId;
  municipalityId?: Types.ObjectId;
  wardId?: Types.ObjectId;
};

const formatSlug = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '.')
    .replace(/^\.+|\.+$/g, '');

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    const provinceModel = app.get<Model<any>>(
      getModelToken(ProvinceEntity.name),
    );
    const districtModel = app.get<Model<any>>(
      getModelToken(DistrictEntity.name),
    );
    const constituencyModel = app.get<Model<any>>(
      getModelToken(ConstituencyEntity.name),
    );
    const municipalityModel = app.get<Model<any>>(
      getModelToken(MunicipalityEntity.name),
    );
    const wardModel = app.get<Model<any>>(getModelToken(WardEntity.name));
    const levelModel = app.get<Model<any>>(getModelToken(LevelEntity.name));
    const positionModel = app.get<Model<any>>(
      getModelToken(PositionEntity.name),
    );
    const partyModel = app.get<Model<any>>(getModelToken(PartyEntity.name));
    const politicianModel = app.get<Model<any>>(
      getModelToken(PoliticianEntity.name),
    );
    const userModel = app.get<Model<any>>(getModelToken(UserEntity.name));
    const citizenModel = app.get<Model<any>>(getModelToken(CitizenEntity.name));
    const adminModel = app.get<Model<any>>(getModelToken(AdminEntity.name));
    const reportModel = app.get<Model<any>>(getModelToken(ReportEntity.name));
    const caseModel = app.get<Model<any>>(getModelToken(CaseEntity.name));
    const eventModel = app.get<Model<any>>(getModelToken(EventEntity.name));
    const budgetModel = app.get<Model<any>>(getModelToken(BudgetEntity.name));
    const pollModel = app.get<Model<any>>(getModelToken(PollEntity.name));
    const pollOptionModel = app.get<Model<any>>(
      getModelToken(PollOptionEntity.name),
    );
    const pollVoteModel = app.get<Model<any>>(
      getModelToken(PollVoteEntity.name),
    );
    const messageModel = app.get<Model<any>>(getModelToken(MessageEntity.name));

    const [
      provinces,
      districts,
      constituencies,
      municipalities,
      wards,
      politicians,
      levels,
      positions,
      parties,
      polls,
    ] = await Promise.all([
      provinceModel.find().sort({ provinceNumber: 1 }),
      districtModel.find().sort({ name: 1 }),
      constituencyModel.find().sort({ constituencyNumber: 1 }),
      municipalityModel.find().sort({ name: 1 }),
      wardModel.find().sort({ wardNumber: 1 }),
      politicianModel.find().sort({ fullName: 1 }),
      levelModel.find().sort({ name: 1 }),
      positionModel.find().sort({ title: 1 }),
      partyModel.find().sort({ name: 1 }),
      pollModel.find().sort({ createdAt: 1 }),
    ]);

    if (
      !provinces.length ||
      !districts.length ||
      !municipalities.length ||
      !wards.length
    ) {
      throw new Error(
        'Base location data is missing. Run the ordered root seed script first.',
      );
    }

    const existingSeededUsers = await userModel.find(
      { email: new RegExp(`@${SEEDED_DOMAIN}$`) },
      { _id: 1, role: 1 },
    );
    const seededUserIds = existingSeededUsers.map((user) => user._id);

    if (seededUserIds.length) {
      await pollVoteModel.deleteMany({ userId: { $in: seededUserIds } });
    }

    await Promise.all([
      seededUserIds.length
        ? citizenModel.deleteMany({ userId: { $in: seededUserIds } })
        : Promise.resolve(),
      seededUserIds.length
        ? adminModel.deleteMany({ userId: { $in: seededUserIds } })
        : Promise.resolve(),
      seededUserIds.length
        ? politicianModel.updateMany(
            { userId: { $in: seededUserIds } },
            { $unset: { userId: '' } },
          )
        : Promise.resolve(),
      userModel.deleteMany({ email: new RegExp(`@${SEEDED_DOMAIN}$`) }),
      reportModel.deleteMany({ tags: 'seeded' }),
      caseModel.deleteMany({ title: /^\[Seeded\]/ }),
      eventModel.deleteMany({ title: /^\[Seeded\]/ }),
      budgetModel.deleteMany({ isSeeded: true }),
      messageModel.deleteMany({ tags: 'seeded' }),
    ]);

    const defaultPassword = await bcrypt.hash('saasan123', PASSWORD_SALT);

    const locationBundles: LocationBundle[] = wards.map(
      (ward: any, index: number) => ({
        provinceId: ward.provinceId || provinces[index % provinces.length]._id,
        districtId: ward.districtId || districts[index % districts.length]._id,
        constituencyId:
          ward.constituencyId ||
          constituencies[index % Math.max(constituencies.length, 1)]?._id,
        municipalityId:
          ward.municipalityId ||
          municipalities[index % municipalities.length]._id,
        wardId: ward._id,
      }),
    );

    const getLocationBundle = (index: number) =>
      locationBundles[index % locationBundles.length];

    const createdUsers: any[] = [];

    const adminDefinitions = [
      {
        email: `admin@${SEEDED_DOMAIN}`,
        fullName: 'Seed Admin',
        role: UserRole.ADMIN,
      },
      {
        email: `ops.admin@${SEEDED_DOMAIN}`,
        fullName: 'Operations Admin',
        role: UserRole.ADMIN,
      },
    ];

    for (let index = 0; index < adminDefinitions.length; index++) {
      const user = await userModel.create({
        email: adminDefinitions[index].email,
        password: defaultPassword,
        role: adminDefinitions[index].role,
        isVerified: true,
      });
      const admin = await adminModel.create({
        userId: user._id,
        fullName: adminDefinitions[index].fullName,
        designation: index === 0 ? 'System Admin' : 'Operations Admin',
      });
      createdUsers.push({
        ...user.toObject(),
        profileId: admin._id,
        fullName: admin.fullName,
      });
    }

    for (let index = 0; index < 18; index++) {
      const location = getLocationBundle(index + 3);
      const user = await userModel.create({
        email: `citizen.${index + 1}@${SEEDED_DOMAIN}`,
        password: defaultPassword,
        role: UserRole.CITIZEN,
        isVerified: true,
      });
      const citizen = await citizenModel.create({
        userId: user._id,
        fullName: `Seed Citizen ${index + 1}`,
        ...location,
      });
      createdUsers.push({
        ...user.toObject(),
        profileId: citizen._id,
        fullName: citizen.fullName,
        provinceId: citizen.provinceId,
        districtId: citizen.districtId,
        constituencyId: citizen.constituencyId,
        municipalityId: citizen.municipalityId,
        wardId: citizen.wardId,
      });
    }

    const seededPoliticians = politicians.slice(
      0,
      Math.min(politicians.length, 8),
    );
    for (let index = 0; index < seededPoliticians.length; index++) {
      const politician = seededPoliticians[index];
      const fallbackLocation = getLocationBundle(index + 30);
      const politicianId =
        politician._id instanceof Types.ObjectId
          ? politician._id
          : new Types.ObjectId(politician._id);
      const seededPoliticianEmail = `${formatSlug(politician.fullName)}.${politicianId.toHexString().slice(-6)}@${SEEDED_DOMAIN}`;
      const user = await userModel.create({
        email: seededPoliticianEmail,
        password: defaultPassword,
        role: UserRole.POLITICIAN,
        isVerified: true,
      });

      await politicianModel.findByIdAndUpdate(politicianId, {
        $set: {
          userId: user._id,
          constituencyId:
            politician.constituencyId instanceof Types.ObjectId
              ? politician.constituencyId
              : fallbackLocation.constituencyId,
        },
      });

      createdUsers.push({
        ...user.toObject(),
        fullName: politician.fullName,
        politicianId,
        provinceId: fallbackLocation.provinceId,
        districtId: fallbackLocation.districtId,
        constituencyId:
          politician.constituencyId instanceof Types.ObjectId
            ? politician.constituencyId
            : fallbackLocation.constituencyId,
        municipalityId: fallbackLocation.municipalityId,
        wardId: fallbackLocation.wardId,
      });
    }

    const citizenUsers = createdUsers.filter(
      (user) => user.role === UserRole.CITIZEN,
    );
    const politicianUsers = createdUsers.filter(
      (user) => user.role === UserRole.POLITICIAN,
    );

    const reportDocs: any[] = [];
    for (let index = 0; index < 30; index++) {
      const citizen = citizenUsers[index % citizenUsers.length];
      const politician =
        seededPoliticians[index % Math.max(seededPoliticians.length, 1)];
      const occurredAt = new Date();
      occurredAt.setDate(occurredAt.getDate() - (index % 14));

      const ymd = new Date(Date.now())
        .toISOString()
        .slice(0, 10)
        .replace(/-/g, '');
      const shortId = Math.random().toString(36).slice(-6).toUpperCase();
      const referenceNumber = `${ymd}${shortId}`;

      reportDocs.push({
        title: `[Seeded] Public Service Report ${index + 1}`,
        referenceNumber: referenceNumber,
        description: `Seeded corruption report ${index + 1} for dashboard and moderation flows.`,
        reporterId: citizen._id,
        amountInvolved: (index + 1) * 12000,
        isResolved: index % 4 === 0,
        resolvedAt: index % 4 === 0 ? new Date() : undefined,
        isAnonymous: index % 5 === 0,
        provinceId: citizen.provinceId,
        districtId: citizen.districtId,
        constituencyId: citizen.constituencyId,
        municipalityId: citizen.municipalityId,
        wardId: citizen.wardId,
        dateOccurred: occurredAt,
        peopleAffectedCount: 5 + (index % 12),
        reportLevel: ['ward', 'municipality', 'constituency', 'district'][
          index % 4
        ],
        tags: ['seeded', 'fake-data', `batch-${(index % 3) + 1}`],
        targetPoliticianId: politician?._id,
        upvotesCount: 3 + (index % 8),
        viewsCount: 40 + index * 3,
      });
    }
    const createdReports = await reportModel.insertMany(reportDocs);

    const caseDocs = Array.from({ length: 8 }).map((_, index) => ({
      title: `[Seeded] Major Case ${index + 1}`,
      description: `Seeded major case ${index + 1} for trend analytics and listing pages.`,
      status: ['unsolved', 'ongoing', 'solved'][index % 3],
      amountInvolved: Types.Decimal128.fromString(`${(index + 2) * 85000}`),
      dateOccurred: new Date(Date.now() - index * 86400000 * 10),
      peopleAffectedCount: 10 + index * 4,
      upvotesCount: 12 + index * 2,
      viewsCount: 100 + index * 15,
      sharesCount: 15 + index,
      isPublic: true,
    }));
    await caseModel.insertMany(caseDocs);

    const eventCategories = ['Political', 'Governance', 'Conflict', 'Justice'];
    const eventDocs = Array.from({ length: 8 }).map((_, index) => ({
      title: `[Seeded] Civic Event ${index + 1}`,
      description: `Seeded civic event ${index + 1} for timeline and dashboard use.`,
      category: eventCategories[index % eventCategories.length],
      date: new Date(Date.now() - index * 86400000 * 30),
      location:
        municipalities[index % municipalities.length]?.name || 'Kathmandu',
      significance: 'Seeded event used for development and demo data.',
      isVerified: true,
    }));
    await eventModel.insertMany(eventDocs);

    const budgetDocs = Array.from({ length: 12 }).map((_, index) => {
      const location = getLocationBundle(index + 11);
      const politician =
        seededPoliticians[index % Math.max(seededPoliticians.length, 1)];
      return {
        title: `Seeded Budget Program ${index + 1}`,
        description: `Seeded budget allocation ${index + 1} for development and analytics.`,
        amount: 5_000_000 + index * 1_250_000,
        department: [
          'Infrastructure Ministry',
          'Education Ministry',
          'Health Ministry',
          'Urban Development Office',
        ][index % 4],
        year: 2024 + (index % 2),
        status: ['approved', 'pending', 'in_progress'][index % 3],
        category: ['infrastructure', 'education', 'health', 'local_governance'][
          index % 4
        ],
        provinceId: location.provinceId,
        districtId: location.districtId,
        constituencyId: location.constituencyId,
        municipalityId: location.municipalityId,
        wardId: location.wardId,
        politicianId: politician?._id,
        isSeeded: true,
      };
    });
    await budgetModel.insertMany(budgetDocs);

    const pollIds = polls.map((poll) => poll._id);
    const pollOptions = await pollOptionModel.find({
      pollId: { $in: pollIds },
    });
    const optionsByPoll = new Map<string, any[]>();
    for (const option of pollOptions) {
      const key = option.pollId.toString();
      const current = optionsByPoll.get(key) || [];
      current.push(option);
      optionsByPoll.set(key, current);
    }

    const voteDocs: any[] = [];
    for (const poll of polls) {
      const options = optionsByPoll.get(poll._id) || [];
      if (!options.length) continue;

      for (let index = 0; index < citizenUsers.length; index++) {
        if ((index + poll.title.length) % 3 === 0) continue;
        const option = options[(index + poll.title.length) % options.length];
        voteDocs.push({
          pollId: poll._id,
          optionId: option._id,
          userId: citizenUsers[index]._id,
        });
      }
    }

    if (voteDocs.length) {
      await pollVoteModel
        .insertMany(voteDocs, { ordered: false })
        .catch(() => undefined);
    }

    const messageDocs: any[] = [];
    for (
      let index = 0;
      index < Math.min(createdReports.length, politicianUsers.length * 3);
      index++
    ) {
      const report = createdReports[index];
      const citizen = citizenUsers[index % citizenUsers.length];
      const politician = politicianUsers[index % politicianUsers.length];

      messageDocs.push({
        subject: `Seeded report follow-up ${index + 1}`,
        content: `Initial seeded message thread ${index + 1}.`,
        category: [
          MessageCategory.COMPLAINT,
          MessageCategory.REQUEST,
          MessageCategory.QUESTION,
          MessageCategory.SUGGESTION,
        ][index % 4],
        urgency: [
          MessageUrgency.HIGH,
          MessageUrgency.MEDIUM,
          MessageUrgency.LOW,
        ][index % 3],
        status: [
          MessageStatus.PENDING,
          MessageStatus.IN_PROGRESS,
          MessageStatus.RESOLVED,
        ][index % 3],
        jurisdiction: {
          provinceId: citizen.provinceId,
          districtId: citizen.districtId,
          constituencyId: citizen.constituencyId,
          municipalityId: citizen.municipalityId,
          wardId: citizen.wardId,
        },
        participants: {
          citizen: {
            id: citizen._id,
            name: citizen.fullName,
            email: citizen.email,
            location: {
              provinceId: citizen.provinceId?.toString(),
              districtId: citizen.districtId?.toString(),
              constituencyId: citizen.constituencyId?.toString(),
              municipalityId: citizen.municipalityId?.toString(),
              wardId: citizen.wardId?.toString(),
            },
          },
          politician: {
            id: politician.politicianId || politician._id,
            name: politician.fullName,
          },
        },
        messages: [
          {
            senderId: citizen._id,
            senderType: MessageEntrySenderType.CITIZEN,
            content: `Citizen follow-up for seeded report ${index + 1}.`,
            isInternal: false,
            createdAt: new Date(),
          },
        ],
        lastMessageAt: new Date(),
        upvotesCount: index % 9,
        downvotesCount: index % 2,
        viewsCount: 20 + index * 2,
        referenceNumber: `SEEDMSG${String(index + 1).padStart(4, '0')}`,
        tags: ['seeded', 'fake-data'],
        sourceReportId: report._id,
        messageOrigin: 'report_converted',
        isAnonymous: report.isAnonymous,
      });
    }
    await messageModel.insertMany(messageDocs);

    logger.log(
      [
        `Seeded ${provinces.length} provinces, ${districts.length} districts, ${municipalities.length} municipalities, and ${wards.length} wards`,
        `Seeded politics reference data: ${levels.length} levels, ${positions.length} positions, ${parties.length} parties, ${politicians.length} politicians`,
        `Created ${createdUsers.length} fake users (${adminDefinitions.length} admins, ${citizenUsers.length} citizens, ${politicianUsers.length} politicians)`,
        `Created ${createdReports.length} reports, ${caseDocs.length} cases, ${eventDocs.length} events, ${budgetDocs.length} budgets, ${voteDocs.length} poll votes, and ${messageDocs.length} messages`,
        `Default seeded password for fake users: saasan123`,
      ].join('\n'),
    );

    await app.close();
    process.exit(0);
  } catch (error) {
    logger.error('Failed to seed fake data', error);
    await app.close();
    process.exit(1);
  }
}

bootstrap();
