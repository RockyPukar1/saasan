import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Schema as MoonseSchema } from 'mongoose';

export enum NotificationRecipientType {
  CITIZEN = 'CITIZEN',
  POLITICIAN = 'POLITICIAN',
  ADMIN = 'ADMIN',
}

@Schema({
  timestamps: true,
  collection: NotificationEntity.collection,
})
export class NotificationEntity {
  static readonly collection = 'notifications';

  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;

  @Prop({ type: String, required: true, unique: true })
  jobKey: string;

  @Prop({ type: String, required: true })
  title: string;

  @Prop({
    type: String,
    required: true,
  })
  body: string;

  @Prop({
    type: String,
    enum: NotificationRecipientType,
    required: true,
  })
  recipientType: NotificationRecipientType;

  @Prop({
    type: Types.ObjectId,
    required: true,
  })
  recipientId: Types.ObjectId;

  @Prop({
    type: Boolean,
    default: false,
  })
  isRead: boolean;

  @Prop({
    type: MoonseSchema.Types.Mixed,
    default: {},
  })
  metadata: Record<string, any>;
}

export const NotificationSchema =
  SchemaFactory.createForClass(NotificationEntity);
export type NotificationDocument = Document & NotificationEntity;
