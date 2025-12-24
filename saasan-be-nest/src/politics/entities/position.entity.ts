import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { LevelEntity } from './level.entity';

@Schema({ timestamps: true, collection: PositionEntity.collection })
export class PositionEntity {
  static readonly collection = 'positions';
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;

  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: true })
  description: string;

  @Prop({ type: Types.ObjectId, ref: LevelEntity.name })
  levelId: Types.ObjectId;
}

export const PositionEntitySchema =
  SchemaFactory.createForClass(PositionEntity);
export type PositionEntityDocument = Document & PositionEntity;
