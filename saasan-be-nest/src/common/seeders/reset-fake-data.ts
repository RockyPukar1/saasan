import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AppModule } from '../../app.module';
import { BudgetEntity } from '../../budget/entities/budget.entity';
import { CaseEntity } from '../../case/entities/case.entity';
import { EventEntity } from '../../event/entities/event.entity';
import { MessageEntity } from '../../message/entities/message.entity';
import { PollVoteEntity } from '../../poll/entities/poll-vote.entity';
import { ReportEntity } from '../../report/entities/report.entity';
import { ReportVoteEntity } from '../../report/entities/report-vote.entity';
import { UserEntity } from '../../user/entities/user.entity';
import { CitizenEntity } from '../../user/entities/citizen.entity';
import { AdminEntity } from '../../user/entities/admin.entity';
import { PoliticianEntity } from '../../politics/politician/entities/politician.entity';

const logger = new Logger('ResetFakeData');
const SEEDED_DOMAIN = 'seed.saasan.local';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    const userModel = app.get<Model<any>>(getModelToken(UserEntity.name));
    const citizenModel = app.get<Model<any>>(getModelToken(CitizenEntity.name));
    const adminModel = app.get<Model<any>>(getModelToken(AdminEntity.name));
    const politicianModel = app.get<Model<any>>(
      getModelToken(PoliticianEntity.name),
    );
    const reportModel = app.get<Model<any>>(getModelToken(ReportEntity.name));
    const reportVoteModel = app.get<Model<any>>(
      getModelToken(ReportVoteEntity.name),
    );
    const caseModel = app.get<Model<any>>(getModelToken(CaseEntity.name));
    const eventModel = app.get<Model<any>>(getModelToken(EventEntity.name));
    const budgetModel = app.get<Model<any>>(getModelToken(BudgetEntity.name));
    const messageModel = app.get<Model<any>>(getModelToken(MessageEntity.name));
    const pollVoteModel = app.get<Model<any>>(
      getModelToken(PollVoteEntity.name),
    );

    const seededUsers = await userModel.find(
      { email: new RegExp(`@${SEEDED_DOMAIN}$`) },
      { _id: 1 },
    );
    const seededUserIds = seededUsers.map((user) => user._id);

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
      userModel.deleteMany({ email: new RegExp(`@${SEEDED_DOMAIN}$`) }),
      reportModel.deleteMany({ tags: 'seeded' }),
      caseModel.deleteMany({ title: /^\[Seeded\]/ }),
      eventModel.deleteMany({ title: /^\[Seeded\]/ }),
      budgetModel.deleteMany({ isSeeded: true }),
      messageModel.deleteMany({ tags: 'seeded' }),
    ]);

    logger.log('Seeded fake data cleared successfully.');
    await app.close();
    process.exit(0);
  } catch (error) {
    logger.error('Failed to reset fake data', error);
    await app.close();
    process.exit(1);
  }
}

bootstrap();
