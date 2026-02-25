import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Schema as MongooseSchema } from 'mongoose';

import { ReportEntity } from './report.entity';
import { UserEntity } from 'src/user/entities/user.entity';

export enum ReportActivityCategoryEnum {
  PRIORITY = 'priority',
  TYPE = 'type',
  STATUS = 'status',
  VISIBILITY = 'visibility',
}

@Schema({ timestamps: true, collection: ReportActivityEntity.collection })
export class ReportActivityEntity {
  static readonly collection = 'report_activities';
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;

  @Prop({ type: Types.ObjectId, ref: ReportEntity.name, required: true })
  reportId: Types.ObjectId;

  @Prop({
    type: [
      {
        category: { type: String, ReportActivityCategoryEnum, required: true },
        modifiedBy: {
          id: {
            type: Types.ObjectId,
            ref: UserEntity.name,
            required: true,
          },
          fullName: {
            type: String,
            required: true,
          },
        },
        oldValue: { type: String, required: true },
        newValue: { type: String, required: true },
        modifiedAt: { type: Date, required: true, default: Date.now },
        comment: { type: String, required: true },
      },
    ],
    default: [],
  })
  activities: {
    category: ReportActivityCategoryEnum;
    modifiedBy: {
      id: string;
      fullName: string;
    };
    oldValue: string;
    newValue: string;
    modifiedAt: Date;
    comment: string;
  }[];
}

export const ReportActivityEntitySchema =
  SchemaFactory.createForClass(ReportActivityEntity);

export type ReportActivityEntityDocument = Document & ReportActivityEntity;
