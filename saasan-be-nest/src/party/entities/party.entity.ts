import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true, collection: PartyEntity.collection })
export class PartyEntity {
  static readonly collection = 'parties';
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  abbreviation: string;

  @Prop({ type: String, default: 'N/A' })
  ideology?: string;

  @Prop({ type: Date, required: true })
  foundedIn: Date;

  @Prop({ type: String, default: 'N/A' })
  logoUrl?: string;

  @Prop({ type: String, required: true })
  color: string;
}

export const PartyEntitySchema = SchemaFactory.createForClass(PartyEntity);
export type PartyEntityDocument = Document & PartyEntity;
