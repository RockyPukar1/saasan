import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { PoliticianEntity } from './politician.entity';

export enum PoliticianPromiseStatus {
  NOT_STARTED = 'not-started',
  IN_PROGRESS = 'in-progress',
  FULFILLED = 'fulfilled',
}

@Schema({ timestamps: true, collection: PoliticianPromiseEntity.collection })
export class PoliticianPromiseEntity {
  static readonly collection = 'politician-promises';
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;

  @Prop({ type: Types.ObjectId, ref: PoliticianEntity.name })
  politicianId: Types.ObjectId;

  @Prop({
    type: [
      {
        title: { type: String, required: true },
        description: { type: String, required: true },
        status: {
          type: String,
          enum: PoliticianPromiseStatus,
          default: PoliticianPromiseStatus.NOT_STARTED,
        },
        dueDate: { type: Date, required: true },
        progress: { type: Number, default: 0 },
      },
    ],
    default: [],
  })
  promises: {
    title: string;
    description: string;
    status: string;
    dueDate: Date;
    // TODO: milestone for progress
    progress: number;
  }[];
}

export const PoliticianPromiseEntitySchema = SchemaFactory.createForClass(
  PoliticianPromiseEntity,
);
export type PoliticianPromiseEntityDocument = Document &
  PoliticianPromiseEntity;
