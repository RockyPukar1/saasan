import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { ConstituencyEntity } from 'src/location/constituency/entities/constituency.entity';
import { PartyEntity } from 'src/politics/party/entities/party.entity';
import { PositionEntity } from 'src/politics/position/entities/position.entity';

@Schema({ timestamps: true, collection: PoliticianEntity.collection })
export class PoliticianEntity {
  static readonly collection = 'politicians';
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;

  @Prop({ type: String, required: true })
  fullName: string;

  @Prop({ type: Number, default: 'N/A' })
  age: number;

  @Prop({ type: String, required: 'N/A' })
  biography: string;

  @Prop({ type: String, default: 'N/A' })
  education: string;

  @Prop({ type: String, default: 'N/A' })
  profession: string;

  @Prop({ type: Types.ObjectId, ref: ConstituencyEntity.name })
  constituencyId?: Types.ObjectId;

  @Prop({ type: Boolean, default: false })
  isIndependent?: boolean;

  @Prop({ type: Types.ObjectId, ref: PartyEntity.name })
  partyId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: PositionEntity.name })
  positionId?: Types.ObjectId;

  @Prop({ type: Number, default: 0 })
  experienceYears?: number;

  @Prop({ type: String, default: 'N/A' })
  photoUrl?: string;

  @Prop({ type: Boolean, default: true })
  isActive?: boolean;

  @Prop({ type: Number, default: 0 })
  rating?: number;

  @Prop({ type: Number, default: 0 })
  totalReports?: number;

  @Prop({ type: Number, default: 0 })
  verifiedReports?: number;
}

export const PoliticianEntitySchema =
  SchemaFactory.createForClass(PoliticianEntity);
export type PoliticianEntityDocument = Document & PoliticianEntity;
