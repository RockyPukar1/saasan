import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { ConstituencyEntity } from 'src/location/constituency/entities/constituency.entity';
import { DistrictEntity } from 'src/location/district/entities/district.entity';
import { MunicipalityEntity } from 'src/location/municipality/entities/municipality.entity';
import { ProvinceEntity } from 'src/location/province/entities/province.entity';
import { WardEntity } from 'src/location/ward/entities/ward.entity';
import { UserEntity } from 'src/user/entities/user.entity';

export enum ReportStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export enum ReportPriority {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
}
@Schema({ timestamps: true, collection: ReportEntity.collection })
export class ReportEntity {
  static readonly collection = 'reports';
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;

  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: true })
  description: string;

  @Prop({ type: String }) // TODO: separate entity for category
  category?: string;

  @Prop({ type: Types.ObjectId, ref: UserEntity.name })
  reporterId: Types.ObjectId;

  @Prop({ type: Number })
  amountInvolved?: number;

  @Prop({
    type: String,
    enum: ReportStatus,
    default: ReportStatus.PENDING,
  })
  status: ReportStatus;

  @Prop({
    type: String,
    enum: ReportPriority,
    default: ReportPriority.LOW,
  })
  priority: ReportPriority;

  @Prop({ type: Number, default: 0 })
  upvotesCount?: Number;

  @Prop({ type: Number, default: 0 })
  downvotesCount?: Number;

  @Prop({ type: Number, default: 0 })
  viewsCount?: Number;

  @Prop({ type: Number, unique: true })
  referenceNumber?: number;

  @Prop({ type: [String] })
  tags?: string[];

  @Prop({ type: String })
  verificationNotes?: string;

  @Prop({ type: Types.ObjectId, ref: UserEntity.name })
  verifiedById: Types.ObjectId;

  @Prop({ type: Date })
  verifiedAt: Date;

  @Prop({ type: Boolean, default: false })
  isPublic: boolean;

  @Prop({ type: Types.ObjectId, ref: UserEntity.name })
  assignedToOfficerId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: ProvinceEntity.name })
  provinceId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: DistrictEntity.name })
  districtId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: ConstituencyEntity.name })
  constituencyId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: MunicipalityEntity.name })
  municipalityId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: WardEntity.name })
  wardId?: Types.ObjectId;
}

export const ReportEntitySchema = SchemaFactory.createForClass(ReportEntity);
export type ReportEntityDocument = Document & ReportEntity;
