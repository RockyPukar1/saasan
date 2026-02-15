import { InjectModel } from '@nestjs/mongoose';
import {
  EvidenceEntity,
  EvidenceEntityDocument,
} from '../entities/evidence.entity';
import { ClientSession, Model, Types } from 'mongoose';
import { ReportIdDto } from '../dtos/report-id.dto';
import { EvidenceIdDto } from '../dtos/evidence-id.dto';

export class EvidenceRepository {
  constructor(
    @InjectModel(EvidenceEntity.name)
    private readonly model: Model<EvidenceEntityDocument>,
  ) {}

  async findByReportId({ reportId }: ReportIdDto) {
    return await this.model.findOne({ reportId: new Types.ObjectId(reportId) });
  }

  async addEvidence(
    { reportId }: ReportIdDto,
    evidences: any,
    session: ClientSession,
  ) {
    return await this.model.updateOne(
      { reportId: new Types.ObjectId(reportId) },
      {
        $setOnInsert: {
          reportId: new Types.ObjectId(reportId),
        },
        $push: {
          evidences: {
            $each: evidences.map((evidence) => ({
              id: new Types.ObjectId(),
              ...evidence,
            })),
          },
        },
      },
      { upsert: true, session },
    );
  }

  async removeEvidence(
    { reportId }: ReportIdDto,
    { evidenceId }: EvidenceIdDto,
  ) {
    return this.model.updateOne(
      { reportId: new Types.ObjectId(reportId) },
      { $pull: { evidences: { _id: new Types.ObjectId(evidenceId) } } },
    );
  }
}
