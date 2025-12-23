import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true, collection: PollEntity.collection })
export class PollEntity {
  static readonly collection = 'dashboard';
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export const PollEntitySchema = SchemaFactory.createForClass(PollEntity);
export type PollEntityDocument = Document & PollEntity;
