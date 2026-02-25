import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Schema as MongooseSchema } from 'mongoose';

import { ReportEntity } from './report.entity';
import { UserEntity } from 'src/user/entities/user.entity';

enum ActivityTypeEnum {
  CREATED = 'created',
  UPDATED = 'updated',
  DELETED = 'deleted',
}

enum ActivityCategoryEnum {
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
        type: { type: String, enum: ActivityTypeEnum, required: true },
        category: { type: String, enum: ActivityCategoryEnum, required: true },
        modifiedById: {
          type: Types.ObjectId,
          ref: UserEntity.name,
          required: true,
        },
        modifiedAt: { type: Date, required: true },
        comment: { type: String, required: true },
      },
    ],
    default: [],
  })
  activities: {
    type: ActivityTypeEnum;
    category: ActivityCategoryEnum;
    modifiedById: Types.ObjectId;
    modifiedAt: Date;
    comment: string;
  }[];
}

export const ReportActivityEntitySchema =
  SchemaFactory.createForClass(ReportActivityEntity);

export type ReportActivityEntityDocument = Document & ReportActivityEntity;
