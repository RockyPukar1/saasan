import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { ConstituencyEntity } from 'src/location/constituency/entities/constituency.entity';
import { PartyEntity } from 'src/party/entities/party.entity';
import { PoliticianEntity } from 'src/politician/entities/politician.entity';

@Schema({ timestamps: true, collection: ElectionCandidateEntity.collection })
export class ElectionCandidateEntity {
  static readonly collection = 'election-candidates';
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;

  @Prop({ type: Types.ObjectId, ref: PoliticianEntity.name })
  politicianId: Types.ObjectId;

  @Prop({ type: String, required: true })
  electionType: string;

  @Prop({ type: Date, required: true })
  electionYear: Date;

  @Prop({ type: Types.ObjectId, ref: ConstituencyEntity.name })
  constituencyId: Types.ObjectId;

  @Prop({ type: Boolean, default: false })
  isIndependent?: boolean;

  @Prop({ type: Types.ObjectId, ref: PartyEntity.name })
  partyId: Types.ObjectId;

  @Prop({ type: Number })
  candidateNumber?: number;

  @Prop({ type: String })
  symbol?: string;

  @Prop({ type: String })
  manifesto: string;

  @Prop({ type: [String] })
  keyPromises: string[];

  @Prop({ type: String, default: 'N/A' })
  educationBackground: string;

  @Prop({ type: String, default: 'N/A' })
  professionalExperience?: string;

  @Prop({ type: [String], default: [] })
  criminalRecords?: string[];

  @Prop({ type: [String], default: [] })
  assetDeclaration?: string;

  @Prop({ type: Date, required: true })
  nominationDate?: Date;

  @Prop({ type: Date, required: true })
  withdrawalDate?: Date;

  @Prop({ type: Boolean, default: true })
  isActive: boolean;

  @Prop({ type: Number, default: 0 })
  voteCount: number;
}

export const ElectionCandidateEntitySchema = SchemaFactory.createForClass(
  ElectionCandidateEntity,
);
export type ElectionCandidateEntityDocument = Document &
  ElectionCandidateEntity;
