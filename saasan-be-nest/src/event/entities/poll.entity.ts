import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true, collection: PollEntity.collection })
export class PollEntity {
  static readonly collection = 'polls';
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;

  @Prop({ type: String, required: true })
  title: string;

  @Prop({
    type: [Types.ObjectId],
    ref: 'PollOptionEntity',
    default: [],
  })
  options: Types.ObjectId[];

  @Prop({ type: String, required: true })
  description: string;

  @Prop({ type: String })
  type?: string;

  @Prop({ type: String, options: ['active', 'inactive'], default: 'active' })
  status?: string;

  @Prop({ type: String })
  category?: string;

  @Prop({ type: Date, required: true })
  startDate: Date;

  @Prop({ type: Date, required: true })
  endDate: Date;

  @Prop({ type: Types.ObjectId, ref: 'UserEntity' })
  createdBy?: Types.ObjectId;

  @Prop({ type: Number, default: 0 })
  totalVotes: number;

  @Prop({ type: Boolean, default: false })
  requiresVerification: boolean;
}

export const PollEntitySchema = SchemaFactory.createForClass(PollEntity);
export type PollEntityDocument = Document & PollEntity;
