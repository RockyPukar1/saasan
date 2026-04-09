import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { PoliticianEntity } from './politician.entity';

@Schema({ timestamps: true, collection: PoliticianAccountEntity.collection })
export class PoliticianAccountEntity {
  static readonly collection = 'politician_accounts';
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;

  @Prop({ type: Types.ObjectId, ref: PoliticianEntity.name, required: true })
  politicianId: Types.ObjectId;

  @Prop({ type: String, required: true })
  password?: string;

  @Prop({ type: Date })
  accountCreatedAt?: Date;

  @Prop({ type: Date })
  lastLoginAt?: Date;
}

export const PoliticianAccountEntitySchema = SchemaFactory.createForClass(
  PoliticianAccountEntity,
);
export type PoliticianAccountEntityDocument = Document &
  PoliticianAccountEntity;
