import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ReportEntity } from './report.entity';
import { UserEntity } from 'src/user/entities/user.entity';

@Schema({ timestamps: true, collection: ReportVoteEntity.collection })
export class ReportVoteEntity {
  static readonly collection = 'report_votes';
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;

  @Prop({ type: Types.ObjectId, ref: ReportEntity.name, required: true })
  reportId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: UserEntity.name, required: true })
  userId: Types.ObjectId;

  @Prop({ type: String, enum: ['up', 'down'], required: true })
  direction: 'up' | 'down';
}

export const ReportVoteEntitySchema =
  SchemaFactory.createForClass(ReportVoteEntity);

ReportVoteEntitySchema.index(
  { userId: 1, reportId: 1 },
  {
    unique: true,
  },
);

export type ReportVoteEntityDocument = Document & ReportVoteEntity;
