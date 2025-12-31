import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { PollEntity } from './poll.entity';

@Schema({ timestamps: true, collection: PollOptionEntity.collection })
export class PollOptionEntity {
  static readonly collection = 'poll-options';
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;

  @Prop({ type: Types.ObjectId, ref: PollEntity.name })
  pollId: Types.ObjectId;

  @Prop({ type: String, required: true })
  text: string;
}

export const PollOptionEntitySchema =
  SchemaFactory.createForClass(PollOptionEntity);
export type PollOptionEntityDocument = Document & PollOptionEntity;
