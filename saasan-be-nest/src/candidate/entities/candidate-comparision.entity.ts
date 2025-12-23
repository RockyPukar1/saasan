import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { CandidateComparisionCriteriaEntity } from 'src/candidate/entities/candidate-comparision-criteria.entity';
import { ElectionCandidateEntity } from 'src/candidate/entities/election-candidate.entity';
import { UserEntity } from 'src/user/entities/user.entity';

@Schema({ timestamps: true, collection: CandidateComparisionEntity.collection })
export class CandidateComparisionEntity {
  static readonly collection = 'candidate-comparisions';
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;

  @Prop({ type: Types.ObjectId, ref: UserEntity.name })
  userId: Types.ObjectId;

  @Prop({ type: [Types.ObjectId], ref: ElectionCandidateEntity.name })
  candidates: Types.ObjectId[];

  @Prop({
    type: [Types.ObjectId],
    ref: CandidateComparisionCriteriaEntity.name,
  })
  comparisonCriteriaId: Types.ObjectId[];

  @Prop({ type: Date, default: Date.now })
  comparisionDate: Date;
}

export const CandidateComparisionEntitySchema = SchemaFactory.createForClass(
  CandidateComparisionEntity,
);
export type CandidateComparisionEntityDocument = Document &
  CandidateComparisionEntity;
