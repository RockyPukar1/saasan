import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true, collection: LevelEntity.collection })
export class LevelEntity {
  static readonly collection = 'levels';
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  description: string;
}

export const LevelEntitySchema = SchemaFactory.createForClass(LevelEntity);
export type LevelEntityDocument = Document & LevelEntity;
