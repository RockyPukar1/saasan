import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true, collection: VoterIntentSurveyEntity.collection })
export class VoterIntentSurveyEntity {
  static readonly collection = 'voter-intent-surveys';
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export const ElectionCandidateEntitySchema = SchemaFactory.createForClass(
  VoterIntentSurveyEntity,
);
export type VoterIntentSurveyEntityDocument = Document &
  VoterIntentSurveyEntity;
