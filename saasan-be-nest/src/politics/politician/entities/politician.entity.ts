import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Schema as MongooseSchema } from 'mongoose';
import { ConstituencyEntity } from 'src/location/constituency/entities/constituency.entity';
import { PartyEntity } from 'src/politics/party/entities/party.entity';
import { PositionEntity } from 'src/politics/position/entities/position.entity';

interface IExperience {
  category: string;
  title: string;
  company: string;
  startDate: Date;
  endDate: Date;
}

@Schema({ timestamps: true, collection: PoliticianEntity.collection })
export class PoliticianEntity {
  static readonly collection = 'politicians';
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;

  // Personal information
  @Prop({ type: String, required: true })
  fullName: string;

  @Prop({ type: Number })
  age?: number;

  @Prop({ type: String })
  biography?: string;

  @Prop({ type: String })
  education?: string;

  @Prop({ type: String })
  profession?: string;

  @Prop({
    type: MongooseSchema.Types.Mixed,
    default: [],
  })
  experiences?: IExperience[];

  @Prop({
    type: MongooseSchema.Types.Mixed,
    default: {},
  })
  contact: {
    phone?: string;
    email?: string;
    website?: string;
  };

  @Prop({
    type: MongooseSchema.Types.Mixed,
    default: {},
  })
  socialMedia: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
  };

  @Prop({ type: Date })
  joinedDate?: Date;

  @Prop({ type: Number, default: 0 })
  totalVotes?: number;

  @Prop({ type: Types.ObjectId, ref: ConstituencyEntity.name })
  constituencyId?: Types.ObjectId;

  @Prop({ type: Boolean, default: false })
  isIndependent?: boolean;

  @Prop({ type: Types.ObjectId, ref: PartyEntity.name })
  partyId?: Types.ObjectId;

  @Prop({
    type: [{ type: [{ type: Types.ObjectId, ref: PositionEntity.name }] }],
    default: [],
  })
  positionIds?: string[];

  @Prop({ type: Number, default: 0 })
  experienceYears?: number;

  @Prop({ type: Date })
  termStartDate?: Date;

  @Prop({ type: Date })
  termEndDate?: Date;

  @Prop({ type: String })
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
