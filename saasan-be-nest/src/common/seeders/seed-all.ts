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
import {
  PoliticianAnnouncementEntity,
  PoliticianAnnouncementPriority,
  PoliticianAnnouncementType,
} from '../../politics/politician/entities/politician-announcement.entity';
import { PoliticianEntity } from '../../politics/politician/entities/politician.entity';
import { PoliticianAchievementEntity } from '../../politics/politician/entities/politician-achievement.entity';
import { PoliticianPromiseEntity } from '../../politics/politician/entities/politician-promise.entity';
import { PositionEntity } from '../../politics/position/entities/position.entity';
import { PollOptionEntity } from '../../poll/entities/poll-option.entity';
import { PollVoteEntity } from '../../poll/entities/poll-vote.entity';
import { PollEntity } from '../../poll/entities/poll.entity';
import { ReportEntity } from '../../report/entities/report.entity';
import {
  ReportDiscussionAuthorRole,
  ReportDiscussionCommentEntity,
} from '../../report/entities/report-discussion-comment.entity';
import { ReportDiscussionCommentVoteEntity } from '../../report/entities/report-discussion-comment-vote.entity';
import { ReportDiscussionParticipantEntity } from '../../report/entities/report-discussion-participant.entity';
import { ReportVoteEntity } from '../../report/entities/report-vote.entity';
import {
  PASSWORD_SALT,
  UserEntity,
  UserRole,
} from '../../user/entities/user.entity';
import { CitizenEntity } from '../../user/entities/citizen.entity';
import { AdminEntity } from '../../user/entities/admin.entity';
import { RolePermissionEntity } from '../../role-permission/entities/role-permission.entity';
import { DEFAULT_ROLE_PERMISSIONS } from '../constants/role-permission.constants';
import politicianSeedData from './politics/data/politician.json';

const logger = new Logger('SeedAll');
const SEEDED_DOMAIN = 'seed.saasan.local';
const DEFAULT_POLITICIAN_PREFERENCES = {
  notifications: {
    email: true,
    push: false,
    sms: true,
    messageUpdates: true,
    promiseReminders: true,
    announcementUpdates: true,
    systemNotifications: true,
    weeklySummary: false,
  },
  appearance: {
    theme: 'system',
    language: 'english',
    timezone: 'Asia/Kathmandu',
    compactMode: false,
    showTimestamps: true,
    enableAnimations: true,
    highContrastMode: false,
  },
  privacy: {
    profileVisibility: 'public',
    showContactInfo: true,
    showActivityStatus: false,
    allowMessageRequests: true,
  },
  advanced: {
    developerMode: false,
    betaFeatures: false,
  },
} as const;

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
    const politicianPromiseModel = app.get<Model<any>>(
      getModelToken(PoliticianPromiseEntity.name),
    );
    const politicianAchievementModel = app.get<Model<any>>(
      getModelToken(PoliticianAchievementEntity.name),
    );
    const politicianAnnouncementModel = app.get<Model<any>>(
      getModelToken(PoliticianAnnouncementEntity.name),
    );
    const userModel = app.get<Model<any>>(getModelToken(UserEntity.name));
    const citizenModel = app.get<Model<any>>(getModelToken(CitizenEntity.name));
    const adminModel = app.get<Model<any>>(getModelToken(AdminEntity.name));
    const rolePermissionModel = app.get<Model<any>>(
      getModelToken(RolePermissionEntity.name),
    );
    const reportModel = app.get<Model<any>>(getModelToken(ReportEntity.name));
    const reportVoteModel = app.get<Model<any>>(
      getModelToken(ReportVoteEntity.name),
    );
    const reportDiscussionCommentModel = app.get<Model<any>>(
      getModelToken(ReportDiscussionCommentEntity.name),
    );
    const reportDiscussionParticipantModel = app.get<Model<any>>(
      getModelToken(ReportDiscussionParticipantEntity.name),
    );
    const reportDiscussionCommentVoteModel = app.get<Model<any>>(
      getModelToken(ReportDiscussionCommentVoteEntity.name),
    );
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
    const seededPoliticianIds = politicians
      .slice(0, Math.min(politicians.length, 8))
      .map((politician) =>
        politician._id instanceof Types.ObjectId
          ? politician._id
          : new Types.ObjectId(politician._id),
      );

    if (seededUserIds.length) {
      await pollVoteModel.deleteMany({ userId: { $in: seededUserIds } });
      await reportVoteModel.deleteMany({ userId: { $in: seededUserIds } });
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
      seededPoliticianIds.length
        ? politicianAnnouncementModel.deleteMany({
            politicianId: { $in: seededPoliticianIds },
          })
        : Promise.resolve(),
      userModel.deleteMany({ email: new RegExp(`@${SEEDED_DOMAIN}$`) }),
      reportModel.deleteMany({ tags: 'seeded' }),
      reportDiscussionCommentModel.deleteMany({}),
      reportDiscussionCommentVoteModel.deleteMany({}),
      reportDiscussionParticipantModel.deleteMany({}),
      caseModel.deleteMany({ title: /^\[Seeded\]/ }),
      eventModel.deleteMany({ title: /^\[Seeded\]/ }),
      budgetModel.deleteMany({ isSeeded: true }),
      messageModel.deleteMany({ tags: 'seeded' }),
    ]);

    await Promise.all(
      Object.entries(DEFAULT_ROLE_PERMISSIONS).map(([role, permissions]) =>
        rolePermissionModel.findOneAndUpdate(
          { role },
          {
            $set: {
              role,
              permissions,
            },
          },
          { upsert: true, new: true },
        ),
      ),
    );

    const defaultPassword = await bcrypt.hash('saasan123', PASSWORD_SALT);
    const politicianSeedMap = new Map(
      politicianSeedData.map((politician) => [politician.fullName, politician]),
    );

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
      const seededPoliticianEmail = `${formatSlug(politician.fullName)}@${SEEDED_DOMAIN}`;
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
          preferences: DEFAULT_POLITICIAN_PREFERENCES,
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

    const seededAnnouncementDocs: any[] = [];
    for (let index = 0; index < seededPoliticians.length; index++) {
      const politician = seededPoliticians[index];
      const politicianId =
        politician._id instanceof Types.ObjectId
          ? politician._id
          : new Types.ObjectId(politician._id);
      const seedSource = politicianSeedMap.get(politician.fullName);

      if (!seedSource) continue;

      const achievementAnnouncements = (seedSource.achievements || [])
        .slice(0, 2)
        .map((achievement, achievementIndex) => ({
          politicianId,
          createdBy: politicianId,
          title: achievement.title,
          content: achievement.description,
          type: PoliticianAnnouncementType.ACHIEVEMENT,
          priority:
            achievementIndex === 0
              ? PoliticianAnnouncementPriority.HIGH
              : PoliticianAnnouncementPriority.MEDIUM,
          isPublic: true,
          publishedAt: new Date(achievement.date),
          scheduledAt: null,
          createdAt: new Date(achievement.date),
          updatedAt: new Date(achievement.date),
        }));

      const promiseAnnouncements = (seedSource.promises || [])
        .slice(0, 2)
        .map((promise, promiseIndex) => ({
          politicianId,
          createdBy: politicianId,
          title: `${politician.fullName.split(' ')[0]}'s update: ${promise.title}`,
          content: `${promise.description} Current progress: ${promise.progress}% and status ${promise.status}.`,
          type: PoliticianAnnouncementType.UPDATE,
          priority:
            promise.progress >= 75
              ? PoliticianAnnouncementPriority.HIGH
              : promiseIndex === 0
                ? PoliticianAnnouncementPriority.MEDIUM
                : PoliticianAnnouncementPriority.LOW,
          isPublic: true,
          publishedAt: new Date(promise.dueDate),
          scheduledAt: null,
          createdAt: new Date(promise.dueDate),
          updatedAt: new Date(promise.dueDate),
        }));

      seededAnnouncementDocs.push(
        ...achievementAnnouncements,
        ...promiseAnnouncements,
      );
    }

    if (seededAnnouncementDocs.length) {
      await politicianAnnouncementModel.insertMany(seededAnnouncementDocs, {
        ordered: false,
      });
    }

    if (seededPoliticianIds.length) {
      await Promise.all(
        seededPoliticianIds.map(async (politicianId) => {
          const promiseDoc = await politicianPromiseModel.findOne({
            politicianId,
          });
          if (promiseDoc) {
            await politicianPromiseModel.updateOne(
              { _id: promiseDoc._id },
              {
                $set: {
                  promises: (promiseDoc.promises || []).map((promise: any) => ({
                    ...promise,
                    status:
                      promise.status === 'ongoing'
                        ? 'in-progress'
                        : promise.status === 'pending'
                          ? 'not-started'
                          : promise.status,
                  })),
                },
              },
            );
          }

          const achievementDoc = await politicianAchievementModel.findOne({
            politicianId,
          });
          if (achievementDoc) {
            await politicianAchievementModel.updateOne(
              { _id: achievementDoc._id },
              {
                $set: {
                  achievements: (achievementDoc.achievements || []).map(
                    (achievement: any) => ({
                      ...achievement,
                      category:
                        achievement.category === 'economic'
                          ? 'economy'
                          : achievement.category,
                    }),
                  ),
                },
              },
            );
          }
        }),
      );
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

    const reportVoteDocs: any[] = [];
    const reportCountUpdates: Array<{
      reportId: any;
      upvotesCount: number;
      downvotesCount: number;
    }> = [];

    for (let index = 0; index < createdReports.length; index++) {
      const report = createdReports[index];
      const voterPool = citizenUsers.filter(
        (citizen) => citizen._id.toString() !== report.reporterId?.toString?.(),
      );
      const desiredUpvotes = Math.min(voterPool.length, 3 + (index % 8));
      const desiredDownvotes = Math.min(
        Math.max(voterPool.length - desiredUpvotes, 0),
        index % 3,
      );

      voterPool.slice(0, desiredUpvotes).forEach((citizen) => {
        reportVoteDocs.push({
          reportId: report._id,
          userId: citizen._id,
          direction: 'up',
        });
      });

      voterPool
        .slice(desiredUpvotes, desiredUpvotes + desiredDownvotes)
        .forEach((citizen) => {
          reportVoteDocs.push({
            reportId: report._id,
            userId: citizen._id,
            direction: 'down',
          });
        });

      reportCountUpdates.push({
        reportId: report._id,
        upvotesCount: desiredUpvotes,
        downvotesCount: desiredDownvotes,
      });
    }

    if (reportVoteDocs.length) {
      await reportVoteModel
        .insertMany(reportVoteDocs, { ordered: false })
        .catch(() => undefined);
    }

    if (reportCountUpdates.length) {
      await reportModel.bulkWrite(
        reportCountUpdates.map((item) => ({
          updateOne: {
            filter: { _id: item.reportId },
            update: {
              $set: {
                upvotesCount: item.upvotesCount,
                downvotesCount: item.downvotesCount,
              },
            },
          },
        })),
      );
    }

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
    const approvedReportUpdates: Array<{
      reportId: any;
      primaryPoliticianId: any;
      assignedPoliticianIds: any[];
    }> = [];
    for (
      let index = 0;
      index < Math.min(createdReports.length, politicianUsers.length * 3);
      index++
    ) {
      const report = createdReports[index];
      const citizen = citizenUsers[index % citizenUsers.length];
      const politician = politicianUsers[index % politicianUsers.length];
      const secondaryPolitician =
        politicianUsers[(index + 1) % politicianUsers.length];
      const assignedPoliticianIds = [
        politician.politicianId || politician._id,
        ...(index % 2 === 0 &&
        secondaryPolitician &&
        secondaryPolitician.politicianId?.toString() !==
          (politician.politicianId || politician._id)?.toString()
          ? [secondaryPolitician.politicianId || secondaryPolitician._id]
          : []),
      ];

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
          politicians: assignedPoliticianIds.map(
            (assignedPoliticianId, assignedIndex) => ({
              id: assignedPoliticianId,
              name:
                assignedIndex === 0
                  ? politician.fullName
                  : secondaryPolitician?.fullName || politician.fullName,
            }),
          ),
        },
        messages: [
          {
            senderId: citizen._id,
            senderType: MessageEntrySenderType.CITIZEN,
            content: `Citizen follow-up for seeded report ${index + 1}.`,
            isInternal: false,
            createdAt: new Date(),
          },
          ...(index % 3 !== 0
            ? [
                {
                  senderId: politician._id,
                  senderType: MessageEntrySenderType.POLITICIAN,
                  content: `Seeded politician response for report ${index + 1}.`,
                  isInternal: false,
                  createdAt: new Date(),
                },
              ]
            : []),
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

      approvedReportUpdates.push({
        reportId: report._id,
        primaryPoliticianId: politician.politicianId || politician._id,
        assignedPoliticianIds,
      });
    }
    await messageModel.insertMany(messageDocs);

    if (approvedReportUpdates.length) {
      await reportModel.bulkWrite(
        approvedReportUpdates.map((item) => ({
          updateOne: {
            filter: { _id: item.reportId },
            update: {
              $set: {
                autoConvertedToMessage: true,
                targetPoliticianId: item.primaryPoliticianId,
                assignedPoliticianIds: item.assignedPoliticianIds,
                verificationNotes:
                  'Seeded approved report for discussion flows',
                verifiedAt: new Date(),
              },
            },
          },
        })),
      );
    }

    const discussionParticipantDocs: any[] = [];
    const discussionCommentDocs: any[] = [];
    const discussionCommentVoteDocs: any[] = [];

    approvedReportUpdates.slice(0, 8).forEach((approvedReport, index) => {
      const report = createdReports.find(
        (createdReport) =>
          createdReport._id.toString() === approvedReport.reportId.toString(),
      );
      const reportOwner = citizenUsers.find(
        (citizen) =>
          citizen._id.toString() === report?.reporterId?.toString?.(),
      );
      const joiningCitizen =
        citizenUsers[(index + 4) % Math.max(citizenUsers.length, 1)];
      const politicianUser =
        politicianUsers[index % Math.max(politicianUsers.length, 1)];
      const adminUser =
        createdUsers.find((user) => user.role === UserRole.ADMIN) ||
        createdUsers[0];

      if (
        !report ||
        !reportOwner ||
        !joiningCitizen ||
        !politicianUser ||
        !adminUser
      ) {
        return;
      }

      discussionParticipantDocs.push(
        {
          reportId: approvedReport.reportId,
          userId: reportOwner._id,
          joinedAt: new Date(),
          lastCommentAt: new Date(),
        },
        {
          reportId: approvedReport.reportId,
          userId: joiningCitizen._id,
          joinedAt: new Date(),
          lastCommentAt: new Date(),
        },
      );

      const topLevelCommentId = new Types.ObjectId();
      const politicianReplyId = new Types.ObjectId();
      const reportOwnerReplyId = new Types.ObjectId();
      const adminCommentId = new Types.ObjectId();

      discussionCommentDocs.push(
        {
          _id: topLevelCommentId,
          reportId: approvedReport.reportId,
          authorId: joiningCitizen._id,
          authorRole: ReportDiscussionAuthorRole.CITIZEN,
          authorDisplayName: joiningCitizen.fullName,
          isReportOwner: false,
          content: `Seeded public discussion comment ${index + 1}.`,
          upvotesCount: 3,
          downvotesCount: 1,
          depth: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          _id: politicianReplyId,
          reportId: approvedReport.reportId,
          authorId: politicianUser._id,
          authorRole: ReportDiscussionAuthorRole.POLITICIAN,
          authorDisplayName: politicianUser.fullName,
          isReportOwner: false,
          content: `Seeded politician reply in public discussion ${index + 1}.`,
          upvotesCount: 3,
          downvotesCount: 0,
          parentCommentId: topLevelCommentId,
          threadRootCommentId: topLevelCommentId,
          depth: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          _id: reportOwnerReplyId,
          reportId: approvedReport.reportId,
          authorId: reportOwner._id,
          authorRole: ReportDiscussionAuthorRole.CITIZEN,
          authorDisplayName: reportOwner.fullName,
          isReportOwner: true,
          content: `Seeded report owner follow-up ${index + 1}.`,
          upvotesCount: 2,
          downvotesCount: 0,
          parentCommentId: politicianReplyId,
          threadRootCommentId: topLevelCommentId,
          depth: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          _id: adminCommentId,
          reportId: approvedReport.reportId,
          authorId: adminUser._id,
          authorRole: ReportDiscussionAuthorRole.ADMIN,
          authorDisplayName: adminUser.fullName,
          isReportOwner: false,
          content: `Seeded admin moderation note ${index + 1}.`,
          upvotesCount: 1,
          downvotesCount: 0,
          depth: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      );

      discussionCommentVoteDocs.push(
        {
          commentId: topLevelCommentId,
          userId: reportOwner._id,
          direction: 'up',
        },
        {
          commentId: topLevelCommentId,
          userId: politicianUser._id,
          direction: 'up',
        },
        {
          commentId: topLevelCommentId,
          userId: adminUser._id,
          direction: 'up',
        },
        {
          commentId: topLevelCommentId,
          userId: joiningCitizen._id,
          direction: 'down',
        },
        {
          commentId: politicianReplyId,
          userId: joiningCitizen._id,
          direction: 'up',
        },
        {
          commentId: politicianReplyId,
          userId: reportOwner._id,
          direction: 'up',
        },
        {
          commentId: politicianReplyId,
          userId: adminUser._id,
          direction: 'up',
        },
        {
          commentId: reportOwnerReplyId,
          userId: politicianUser._id,
          direction: 'up',
        },
        {
          commentId: reportOwnerReplyId,
          userId: joiningCitizen._id,
          direction: 'up',
        },
        {
          commentId: adminCommentId,
          userId: politicianUser._id,
          direction: 'up',
        },
      );
    });

    if (discussionParticipantDocs.length) {
      await reportDiscussionParticipantModel.insertMany(
        discussionParticipantDocs,
        {
          ordered: false,
        },
      );
    }

    if (discussionCommentDocs.length) {
      await reportDiscussionCommentModel.insertMany(discussionCommentDocs, {
        ordered: false,
      });
    }

    if (discussionCommentVoteDocs.length) {
      await reportDiscussionCommentVoteModel.insertMany(
        discussionCommentVoteDocs,
        {
          ordered: false,
        },
      );
    }

    logger.log(
      [
        `Seeded ${provinces.length} provinces, ${districts.length} districts, ${municipalities.length} municipalities, and ${wards.length} wards`,
        `Seeded politics reference data: ${levels.length} levels, ${positions.length} positions, ${parties.length} parties, ${politicians.length} politicians`,
        `Created ${createdUsers.length} fake users (${adminDefinitions.length} admins, ${citizenUsers.length} citizens, ${politicianUsers.length} politicians)`,
        `Created ${createdReports.length} reports, ${reportVoteDocs.length} report votes, ${caseDocs.length} cases, ${eventDocs.length} events, ${budgetDocs.length} budgets, ${voteDocs.length} poll votes, ${messageDocs.length} messages, and ${seededAnnouncementDocs.length} politician announcements`,
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
