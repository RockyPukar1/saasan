import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true, collection: ServiceEntity.collection })
export class ServiceEntity {
  static readonly collection = 'services';
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;

  @Prop({ type: String, required: true })
  fullName: string;

  @Prop({ type: Number, default: 'N/A' })
  age: number;

  @Prop({ type: String, default: 'N/A' })
  education: string;

  @Prop({ type: String, default: 'N/A' })
  profession: string;

  @Prop({ type: String, default: 'N/A' })
  constituencyId?: Types.ObjectId;

  @Prop({ type: Boolean, default: true })
  isIndependent: boolean;

  @Prop({ type: Types.ObjectId })
  partyId?: Types.ObjectId;

  @Prop({ type: String })
  position?: string;

  @Prop({ type: Number, default: 0 })
  experienceYears?: number;

  @Prop({ type: String, default: 'N/A' })
  photoUrl?: string;

  @Prop({ type: Boolean, default: true })
  isActive?: boolean;

  @Prop({ type: Number, default: 0 })
  rating?: number;

  @Prop({ type: Number, default: 0 })
  totalServices?: number;

  @Prop({ type: Number, default: 0 })
  verifiedServices?: number;
}

export const ServiceEntitySchema = SchemaFactory.createForClass(ServiceEntity);
export type ServiceEntityDocument = Document & ServiceEntity;
