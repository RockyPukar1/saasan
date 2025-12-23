import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { ConstituencyEntity } from 'src/location/constituency/entities/constituency.entity';
import { WardEntity } from 'src/location/ward/entities/ward.entity';

@Schema({ timestamps: true, collection: VotingCenterEntity.collection })
export class VotingCenterEntity {
  static readonly collection = 'voter-intent-surveys';
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  address: string;

  @Prop({ type: Types.ObjectId, ref: ConstituencyEntity.name })
  constituencyId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: WardEntity.name })
  wardId: Types.ObjectId;

  @Prop({ type: Number, default: 0 })
  capacity?: number;

  @Prop({ type: String, default: 'N/A' })
  contactPerson?: string;

  @Prop({ type: String, default: 'N/A' })
  contactNumber?: string;

  @Prop({ type: Boolean, default: true })
  isActive?: boolean;
}

export const VotingCenterEntitySchema =
  SchemaFactory.createForClass(VotingCenterEntity);
export type VotingCenterEntityDocument = Document & VotingCenterEntity;
