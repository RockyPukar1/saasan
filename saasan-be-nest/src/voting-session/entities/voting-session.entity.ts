import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { ConstituencyEntity } from 'src/location/constituency/entities/constituency.entity';

enum ElectionType {
  FEDERAL = 'federal',
  PROVINCIAL = 'provincial',
  LOCAL = 'local',
}

@Schema({ timestamps: true, collection: VotingSessionEntity.collection })
export class VotingSessionEntity {
  static readonly collection = 'voting-sessions';
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;

  @Prop({ type: String, enum: ElectionType, required: true })
  electionType: ElectionType;

  @Prop({ type: Date, required: true })
  electionYear: Date;

  @Prop({ type: Types.ObjectId, ref: ConstituencyEntity.name })
  constituencyId: Types.ObjectId;

  @Prop({ type: String, required: true })
  session_name: string;

  @Prop({ type: Date, required: true })
  startDate: Date;

  @Prop({ type: Date, required: true })
  endDate: Date;

  @Prop({ type: Boolean, default: true })
  isActive: boolean;

  @Prop({ type: Number, default: 0 })
  totalEligibleVoters?: number;

  @Prop({ type: Number, default: 0 })
  totalVoteCast?: number;

  @Prop({ type: Boolean, default: false })
  results_published: boolean;
}

export const VotingSessionEntitySchema =
  SchemaFactory.createForClass(VotingSessionEntity);
export type VotingSessionEntityDocument = Document & VotingSessionEntity;
