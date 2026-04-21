import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Schema as MongooseSchema } from 'mongoose';

export enum JobRecordStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  RETRY_SCHEDULED = 'RETRY_SCHEDULED',
  COMPLETED = 'COMPLETED',
  DEAD_LETTERED = 'DEAD_LETTERED',
}

@Schema({ timestamps: true, collection: JobRecordEntity.collection })
export class JobRecordEntity {
  static readonly collection = 'job_records';

  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;

  @Prop({ type: String, required: true, unique: true })
  jobKey: string;

  @Prop({ type: String, required: true })
  topic: string;

  @Prop({ type: String, required: true })
  jobType: string;

  @Prop({ type: String, enum: JobRecordStatus, required: true })
  status: JobRecordStatus;

  @Prop({ type: Number, default: 0 })
  attempts: number;

  @Prop({ type: Number, default: 3 })
  maxAttempts: number;

  @Prop({ type: Date })
  nextRetryAt?: Date;

  @Prop({ type: Date })
  processingStartedAt?: Date;

  @Prop({ type: Date })
  completedAt?: Date;

  @Prop({ type: Date })
  deadLetteredAt?: Date;

  @Prop({ type: String })
  lastError?: string;

  @Prop({ type: MongooseSchema.Types.Mixed, required: true })
  payload: Record<string, any>;
}

export const JobRecordEntitySchema =
  SchemaFactory.createForClass(JobRecordEntity);
export type JobRecordDocument = Document & JobRecordEntity;
