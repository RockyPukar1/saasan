import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage, Types } from 'mongoose';
import { LevelNameDto } from 'src/politics/level/dtos/level-name.dto';
import { CreatePoliticianDto } from '../dtos/create-politician.dto';
import { PoliticianFilterDto } from '../dtos/politician-filter.dto';
import { PoliticianIdDto } from '../dtos/politician-id.dto';
import { UpdatePoliticianDto } from '../dtos/update-politician.dto';
import {
  PoliticianAchievementEntity,
  PoliticianAchievementEntityDocument,
} from '../entities/politician-achievement.entity';
import {
  PoliticianAnnouncementEntity,
  PoliticianAnnouncementEntityDocument,
} from '../entities/politician-announcement.entity';
import {
  PoliticianEntity,
  PoliticianEntityDocument,
} from '../entities/politician.entity';
import {
  PoliticianPromiseEntity,
  PoliticianPromiseEntityDocument,
} from '../entities/politician-promise.entity';

@Injectable()
export class PoliticianRepository {
  constructor(
    @InjectModel(PoliticianEntity.name)
    private readonly model: Model<PoliticianEntityDocument>,
    @InjectModel(PoliticianPromiseEntity.name)
    private readonly promiseModel: Model<PoliticianPromiseEntityDocument>,
    @InjectModel(PoliticianAchievementEntity.name)
    private readonly achievementModel: Model<PoliticianAchievementEntityDocument>,
    @InjectModel(PoliticianAnnouncementEntity.name)
    private readonly announcementModel: Model<PoliticianAnnouncementEntityDocument>,
  ) {}

  async create(politicianData: CreatePoliticianDto) {
    const session = await this.model.startSession();
    session.startTransaction();

    try {
      const politician = await this.model.create([politicianData], { session });
      const politicianId = politician[0]._id;

      if (politicianData.promises && politicianData.promises.length > 0) {
        await this.promiseModel.create(
          [
            {
              politicianId,
              promises: politicianData.promises,
            },
          ],
          { session },
        );
      }

      if (
        politicianData.achievements &&
        politicianData.achievements.length > 0
      ) {
        await this.achievementModel.create(
          [
            {
              politicianId,
              achievements: politicianData.achievements,
            },
          ],
          { session },
        );
      }

      await session.commitTransaction();
      session.endSession();

      return politician[0];
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }

  async findById({ politicianId }: PoliticianIdDto) {
    return (
      await this.model.aggregate(
        this.buildPoliticianDetailPipeline({
          _id: new Types.ObjectId(politicianId),
        }),
      )
    )[0];
  }

  async findByUserId(userId: string) {
    return (
      await this.model.aggregate(
        this.buildPoliticianDetailPipeline({
          userId: new Types.ObjectId(userId),
        }),
      )
    )[0];
  }

  async getAll(politicianFilterDto: PoliticianFilterDto) {
    const partyIds = (politicianFilterDto?.party || []).map(
      (id) => new Types.ObjectId(id),
    );
    const positionIds = (politicianFilterDto?.position || []).map(
      (id) => new Types.ObjectId(id),
    );
    const levelIds = (politicianFilterDto?.level || []).map(
      (id) => new Types.ObjectId(id),
    );

    const hasFilters =
      partyIds.length > 0 || positionIds.length > 0 || levelIds.length > 0;

    return await this.model.aggregate([
      {
        $lookup: {
          from: 'parties',
          localField: 'partyId',
          foreignField: '_id',
          as: 'partyData',
        },
      },
      {
        $lookup: {
          from: 'positions',
          localField: 'positionIds',
          foreignField: '_id',
          as: 'positionData',
        },
      },
      {
        $lookup: {
          from: 'levels',
          localField: 'positionData.levelId',
          foreignField: '_id',
          as: 'levelData',
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'accountData',
        },
      },
      ...(hasFilters
        ? [
            {
              $match: {
                $or: [
                  { partyId: { $in: partyIds } },
                  { positionIds: { $in: positionIds } },
                  { 'positionData.levelId': { $in: levelIds } },
                ],
              },
            },
          ]
        : []),
      {
        $addFields: {
          sourceCategories: {
            party: { $arrayElemAt: ['$partyData.abbreviation', 0] },
            positions: {
              $map: {
                input: '$positionData',
                as: 'pos',
                in: '$$pos.abbreviation',
              },
            },
            levels: {
              $map: {
                input: '$levelData',
                as: 'lvl',
                in: '$$lvl.name',
              },
            },
          },
          hasAccount: {
            $gt: [{ $size: '$accountData' }, 0],
          },
          accountCreatedAt: {
            $arrayElemAt: ['$accountData.createdAt', 0],
          },
        },
      },
      {
        $project: {
          partyData: 0,
          positionData: 0,
          levelData: 0,
          accountData: 0,
        },
      },
    ]);
  }

  findOne(filter: any) {
    return this.model.findOne(filter);
  }

  async findByIdAndUpdate(
    politicianId: string,
    politicianData: UpdatePoliticianDto | Record<string, any>,
  ) {
    return await this.model.findByIdAndUpdate(politicianId, politicianData, {
      lean: true,
      new: true,
    });
  }

  async findByIdAndDelete(politicianId: string) {
    await Promise.all([
      this.promiseModel.deleteMany({
        politicianId: new Types.ObjectId(politicianId),
      }),
      this.achievementModel.deleteMany({
        politicianId: new Types.ObjectId(politicianId),
      }),
      this.announcementModel.deleteMany({
        politicianId: new Types.ObjectId(politicianId),
      }),
    ]);

    await this.model.findByIdAndDelete(politicianId);
  }

  async getPromisesByPoliticianId(politicianId: string) {
    const promiseDoc = await this.promiseModel
      .findOne({
        politicianId: new Types.ObjectId(politicianId),
      })
      .lean();

    return promiseDoc?.promises || [];
  }

  async addPromise(politicianId: string, promiseData: Record<string, unknown>) {
    const promiseDoc = await this.promiseModel.findOneAndUpdate(
      {
        politicianId: new Types.ObjectId(politicianId),
      },
      {
        $push: {
          promises: promiseData,
        },
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      },
    );

    return promiseDoc?.promises?.[promiseDoc.promises.length - 1];
  }

  async updatePromise(
    politicianId: string,
    promiseId: string,
    promiseData: Record<string, unknown>,
  ) {
    await this.promiseModel.updateOne(
      {
        politicianId: new Types.ObjectId(politicianId),
        'promises._id': new Types.ObjectId(promiseId),
      },
      {
        $set: Object.fromEntries(
          Object.entries(promiseData).map(([key, value]) => [
            `promises.$.${key}`,
            value,
          ]),
        ),
      },
    );

    const promiseDoc = await this.promiseModel
      .findOne({
        politicianId: new Types.ObjectId(politicianId),
      })
      .lean();

    return promiseDoc?.promises?.find(
      (promise: any) => promise._id?.toString() === promiseId,
    );
  }

  async deletePromise(politicianId: string, promiseId: string) {
    await this.promiseModel.updateOne(
      {
        politicianId: new Types.ObjectId(politicianId),
      },
      {
        $pull: {
          promises: {
            _id: new Types.ObjectId(promiseId),
          },
        },
      },
    );
  }

  async getAnnouncementsByPoliticianId(politicianId: string) {
    return this.announcementModel
      .find({
        politicianId: new Types.ObjectId(politicianId),
      })
      .sort({ publishedAt: -1, scheduledAt: -1, createdAt: -1 })
      .lean();
  }

  async createAnnouncement(
    politicianId: string,
    createdBy: string,
    announcementData: Record<string, unknown>,
  ) {
    return this.announcementModel.create({
      politicianId: new Types.ObjectId(politicianId),
      createdBy: new Types.ObjectId(createdBy),
      ...announcementData,
    });
  }

  async findAnnouncementById(politicianId: string, announcementId: string) {
    return this.announcementModel.findOne({
      _id: new Types.ObjectId(announcementId),
      politicianId: new Types.ObjectId(politicianId),
    });
  }

  async updateAnnouncement(
    politicianId: string,
    announcementId: string,
    announcementData: Record<string, unknown>,
  ) {
    return this.announcementModel.findOneAndUpdate(
      {
        _id: new Types.ObjectId(announcementId),
        politicianId: new Types.ObjectId(politicianId),
      },
      announcementData,
      { new: true },
    );
  }

  async deleteAnnouncement(
    politicianId: string,
    announcementId: string,
  ): Promise<void> {
    await this.announcementModel.deleteOne({
      _id: new Types.ObjectId(announcementId),
      politicianId: new Types.ObjectId(politicianId),
    });
  }

  async deleteAnnouncementsByPoliticianId(
    politicianId: string,
  ): Promise<void> {
    await this.announcementModel.deleteMany({
      politicianId: new Types.ObjectId(politicianId),
    });
  }

  async getTotalPoliticians() {
    return await this.countDocuments();
  }

  async getTotalActivePoliticians() {
    return await this.countDocuments({
      isActive: true,
    });
  }

  async getByLevel({ levelName }: LevelNameDto) {
    return await this.model.aggregate([
      {
        $lookup: {
          from: 'positions',
          localField: 'positionIds',
          foreignField: '_id',
          as: 'positions',
        },
      },
      {
        $unwind: '$positions',
      },
      {
        $lookup: {
          from: 'levels',
          localField: 'positions.levelId',
          foreignField: '_id',
          as: 'level',
        },
      },
      {
        $unwind: '$level',
      },
      {
        $match: {
          'level.name': { $regex: levelName, $options: 'i' },
        },
      },
      {
        $lookup: {
          from: 'parties',
          localField: 'partyId',
          foreignField: '_id',
          as: 'party',
        },
      },
      {
        $unwind: {
          path: '$party',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'constituencies',
          localField: 'constituencyId',
          foreignField: '_id',
          as: 'constituency',
        },
      },
      {
        $unwind: {
          path: '$constituency',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: '$_id',
          fullName: { $first: '$fullName' },
          partyName: { $first: '$party.abbreviation' },
          constituencyNumber: { $first: '$constituency.constituencyNumber' },
          posts: {
            $push: {
              level: '$level.name',
              position: '$positions.name',
            },
          },
        },
      },
      {
        $project: {
          fullName: 1,
          posts: 1,
          partyName: 1,
          constituencyNumber: 1,
        },
      },
    ]);
  }

  async getByPartyId(partyId: string) {
    return await this.model.aggregate([
      {
        $match: {
          partyId: new Types.ObjectId(partyId),
        },
      },
      {
        $lookup: {
          from: 'parties',
          localField: 'partyId',
          foreignField: '_id',
          as: 'partyData',
        },
      },
      {
        $lookup: {
          from: 'positions',
          localField: 'positionIds',
          foreignField: '_id',
          as: 'positionData',
        },
      },
      {
        $lookup: {
          from: 'levels',
          localField: 'positionData.levelId',
          foreignField: '_id',
          as: 'levelData',
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'accountData',
        },
      },
      {
        $addFields: {
          sourceCategories: {
            party: { $arrayElemAt: ['$partyData.abbreviation', 0] },
            positions: {
              $map: {
                input: '$positionData',
                as: 'pos',
                in: '$$pos.abbreviation',
              },
            },
            levels: {
              $map: {
                input: '$levelData',
                as: 'lvl',
                in: '$$lvl.name',
              },
            },
          },
          hasAccount: {
            $gt: [{ $size: '$accountData' }, 0],
          },
          accountCreatedAt: {
            $arrayElemAt: ['$accountData.createdAt', 0],
          },
        },
      },
      {
        $project: {
          partyData: 0,
          positionData: 0,
          levelData: 0,
          accountData: 0,
        },
      },
    ]);
  }

  async findByIdWithRelations({ politicianId }: PoliticianIdDto) {
    return this.model
      .findById(politicianId)
      .populate(['partyId', 'positionIds', 'constituencyId']);
  }

  async findByJurisdiction(locationFilters: any) {
    const filter: any = {};
    if (locationFilters.wardId) filter.wardId = locationFilters.wardId;
    if (locationFilters.municipalityId)
      filter.municipalityId = locationFilters.municipalityId;
    if (locationFilters.constituencyId)
      filter.constituencyId = locationFilters.constituencyId;
    if (locationFilters.districtId)
      filter.districtId = locationFilters.districtId;
    if (locationFilters.provinceId)
      filter.provinceId = locationFilters.provinceId;

    const politicians = await this.model.find(filter).exec();
    return politicians[0] || null;
  }

  async findAllByJurisdiction(locationFilters: any) {
    const filter: any = {};
    if (locationFilters.wardId) filter.wardId = locationFilters.wardId;
    if (locationFilters.municipalityId)
      filter.municipalityId = locationFilters.municipalityId;
    if (locationFilters.constituencyId)
      filter.constituencyId = locationFilters.constituencyId;
    if (locationFilters.districtId)
      filter.districtId = locationFilters.districtId;
    if (locationFilters.provinceId)
      filter.provinceId = locationFilters.provinceId;

    return await this.model.find(filter).exec();
  }

  async findManyByIds(politicianIds: string[]) {
    return await this.model
      .find({
        _id: {
          $in: politicianIds.map(
            (politicianId) => new Types.ObjectId(politicianId),
          ),
        },
      })
      .exec();
  }

  async findHighestLevelPolitician() {
    const politicians = await this.model.find().sort({ level: -1 }).exec();
    return politicians[0] || null;
  }

  private buildPoliticianDetailPipeline(
    match: Record<string, unknown>,
  ): PipelineStage[] {
    return [
      {
        $match: match,
      },
      {
        $limit: 1,
      },
      {
        $lookup: {
          from: 'parties',
          localField: 'partyId',
          foreignField: '_id',
          as: 'partyData',
        },
      },
      {
        $lookup: {
          from: 'positions',
          localField: 'positionIds',
          foreignField: '_id',
          as: 'positionData',
        },
      },
      {
        $lookup: {
          from: 'levels',
          localField: 'positionData.levelId',
          foreignField: '_id',
          as: 'levelData',
        },
      },
      {
        $lookup: {
          from: 'politician_promises',
          localField: '_id',
          foreignField: 'politicianId',
          as: 'promisesData',
        },
      },
      {
        $lookup: {
          from: 'politician_achievements',
          localField: '_id',
          foreignField: 'politicianId',
          as: 'achievementsData',
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'accountData',
        },
      },
      {
        $addFields: {
          sourceCategories: {
            party: { $arrayElemAt: ['$partyData.abbreviation', 0] },
            positions: {
              $map: {
                input: '$positionData',
                as: 'pos',
                in: '$$pos.abbreviation',
              },
            },
            levels: {
              $map: {
                input: '$levelData',
                as: 'lvl',
                in: '$$lvl.name',
              },
            },
          },
          promises: {
            $ifNull: [{ $arrayElemAt: ['$promisesData.promises', 0] }, []],
          },
          achievements: {
            $ifNull: [
              { $arrayElemAt: ['$achievementsData.achievements', 0] },
              [],
            ],
          },
          hasAccount: {
            $gt: [{ $size: '$accountData' }, 0],
          },
          accountCreatedAt: {
            $arrayElemAt: ['$accountData.createdAt', 0],
          },
        },
      },
      {
        $project: {
          partyData: 0,
          positionData: 0,
          levelData: 0,
          promisesData: 0,
          achievementsData: 0,
          accountData: 0,
        },
      },
    ];
  }

  private async countDocuments(filter?: any) {
    return await this.model.countDocuments(filter);
  }
}
