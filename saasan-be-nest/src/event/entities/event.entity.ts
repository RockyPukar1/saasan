import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true, collection: EventEntity.collection })
export class EventEntity {
  static readonly collection = 'events';
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;

  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: true })
  description: string;

  @Prop({ type: String, required: true, default: 'general' })
  category: string;

  @Prop({ type: Date, required: true })
  year: Date;

  @Prop({ type: String })
  location?: string;

  @Prop({ type: String })
  significance?: string;

  @Prop({ type: String })
  sourceUrl?: string;

  @Prop({ type: Boolean, default: false })
  isVerified: boolean;
}

export const EventEntitySchema = SchemaFactory.createForClass(EventEntity);
export type EventEntityDocument = Document & EventEntity;
