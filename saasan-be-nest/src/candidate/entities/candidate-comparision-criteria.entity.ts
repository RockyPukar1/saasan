import { Schema } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({
  timestamps: true,
  collection: CandidateComparisionCriteriaEntity.name,
})
export class CandidateComparisionCriteriaEntity {
  static readonly collection = 'candidate-comparision-criterias';
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
