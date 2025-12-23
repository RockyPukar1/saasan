import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { ConstituencyEntity } from 'src/location/constituency/entities/constituency.entity';
import { WardEntity } from 'src/location/ward/entities/ward.entity';
import { UserEntity } from 'src/user/entities/user.entity';

enum VerificationStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Schema({ timestamps: true, collection: VoterRegistrationEntity.collection })
export class VoterRegistrationEntity {
  static readonly collection = 'voter-registrations';
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;

  @Prop({ type: Types.ObjectId, ref: UserEntity.name })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: ConstituencyEntity.name })
  constituencyId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: WardEntity.name })
  wardId: Types.ObjectId;

  @Prop({ type: String, required: true, unique: true })
  registrationNumber?: string;

  @Prop({ type: Date, default: Date.now })
  registrationDate: Date;

  @Prop({
    type: String,
    enum: VerificationStatus,
    default: VerificationStatus.PENDING,
  })
  verificationStatus: VerificationStatus;

  @Prop({ type: String })
  verification_notes?: string;
}

export const VoterRegistrationEntitySchema = SchemaFactory.createForClass(
  VoterRegistrationEntity,
);
export type VoterRegistrationEntityDocument = Document &
  VoterRegistrationEntity;
