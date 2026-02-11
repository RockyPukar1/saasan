import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { PoliticianEntity } from './politician.entity';

enum PoliticianAchievementCategory {
  POLICY = 'policy',
  DEVELOPMENT = 'development',
  SOCIAL = 'social',
  ECONOMY = 'economy',
}

@Schema({
  timestamps: true,
  collection: PoliticianAchievementEntity.collection,
})
export class PoliticianAchievementEntity {
  static readonly collection = 'politician-achievements';
  _id: Types.ObjectId;
  createdAt: Date;
  updated: Date;

  @Prop({ type: Types.ObjectId, ref: PoliticianEntity.name })
  politicianId: Types.ObjectId;

  @Prop({
    type: [
      {
        title: {
          type: String,
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
        category: {
          type: String,
          enum: PoliticianAchievementCategory,
          required: true,
        },
        date: { type: Date, required: true },
      },
    ],
    default: [],
  })
  achievements: {
    title: string;
    description: string;
    date: Date;
    category: string;
  }[];
}

export const PoliticianAchievementSchema = SchemaFactory.createForClass(
  PoliticianAchievementEntity,
);
export type PoliticianAchievementEntityDocument = Document &
  PoliticianAchievementEntity;
