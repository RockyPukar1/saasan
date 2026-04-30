import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Schema as MongooseSchema, Document } from 'mongoose';
import { ConstituencyEntity } from 'src/location/constituency/entities/constituency.entity';
import { PartyEntity } from 'src/politics/party/entities/party.entity';
import { PositionEntity } from 'src/politics/position/entities/position.entity';
import { UserEntity } from 'src/user/entities/user.entity';

interface IExperience {
  category: string;
  title: string;
  company: string;
  startDate: Date;
  endDate: Date;
}

interface IPoliticianPreferences {
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
    messageUpdates: boolean;
    promiseReminders: boolean;
    announcementUpdates: boolean;
    systemNotifications: boolean;
    weeklySummary: boolean;
  };
  appearance: {
    theme: 'light' | 'dark' | 'system';
    language: string;
    timezone: string;
    compactMode: boolean;
    showTimestamps: boolean;
    enableAnimations: boolean;
    highContrastMode: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'constituents_only' | 'private';
    showContactInfo: boolean;
    showActivityStatus: boolean;
    allowMessageRequests: boolean;
  };
  advanced: {
    developerMode: boolean;
    betaFeatures: boolean;
  };
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

  @Prop({
    type: Types.ObjectId,
    ref: UserEntity.name,
    unique: true,
    sparse: true,
  })
  userId?: Types.ObjectId;

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

  @Prop({
    type: MongooseSchema.Types.Mixed,
    default: {
      notifications: {
        email: true,
        push: false,
        sms: true,
        messageUpdates: true,
        promiseReminders: true,
        announcementUpdates: true,
        systemNotifications: true,
        weeklySummary: false,
      },
      appearance: {
        theme: 'system',
        language: 'english',
        timezone: 'Asia/Kathmandu',
        compactMode: false,
        showTimestamps: true,
        enableAnimations: true,
        highContrastMode: false,
      },
      privacy: {
        profileVisibility: 'public',
        showContactInfo: true,
        showActivityStatus: false,
        allowMessageRequests: true,
      },
      advanced: {
        developerMode: false,
        betaFeatures: false,
      },
    },
  })
  preferences?: IPoliticianPreferences;
}

export const PoliticianEntitySchema =
  SchemaFactory.createForClass(PoliticianEntity);
export type PoliticianEntityDocument = Document & PoliticianEntity;
