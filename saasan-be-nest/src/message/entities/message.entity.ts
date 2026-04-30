import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Schema as MongooseSchema, Document } from 'mongoose';
import { UserEntity } from 'src/user/entities/user.entity';

export enum MessageCategory {
  COMPLAINT = 'COMPLAINT',
  SUGGESTION = 'SUGGESTION',
  QUESTION = 'QUESTION',
  REQUEST = 'REQUEST',
}

export enum MessageUrgency {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export enum MessageStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
}

interface MessageParticipants {
  citizen: {
    id: string;
    name: string;
    email: string;
    location: {
      provinceId: string;
      districtId: string;
      constituencyId: string;
      municipalityId: string;
      wardId: string;
    };
  };
  politician: {
    id: string;
    name: string;
  };
  politicians?: Array<{
    id: string;
    name: string;
  }>;
  assignedStaff?: Array<{
    id: string;
    name: string;
    role: string;
  }>;
}

export enum MessageEntrySenderType {
  CITIZEN = 'CITIZEN',
  POLITICIAN = 'POLITICIAN',
  STAFF = 'STAFF',
}

export interface MessageEntry {
  _id: Types.ObjectId;
  senderId: Types.ObjectId;
  senderType: MessageEntrySenderType;
  content: string;
  attachments?: Array<{
    _id: Types.ObjectId;
    fileName: string;
    fileType: string;
    fileUrl: string;
    uploadedBy: string;
    uploadedAt: Date;
  }>;
  isInternal: boolean;
  createdAt?: Date;
  readAt?: Date;
}

@Schema({ timestamps: true, collection: MessageEntity.collection })
export class MessageEntity {
  static readonly collection = 'messages';
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;

  @Prop({
    type: String,
    required: true,
  })
  subject: string;

  @Prop({
    type: String,
    required: true,
  })
  content: string;

  @Prop({
    type: String,
    required: true,
    enum: MessageCategory,
  })
  category: MessageCategory;

  @Prop({
    type: String,
    required: true,
    enum: MessageUrgency,
  })
  urgency: MessageUrgency;

  @Prop({
    type: String,
    required: true,
    enum: MessageStatus,
    default: MessageStatus.PENDING,
  })
  status: MessageStatus;

  @Prop({
    type: MongooseSchema.Types.Mixed,
    required: true,
  })
  jurisdiction: {
    provinceId: Types.ObjectId;
    districtId: Types.ObjectId;
    constituencyId: Types.ObjectId;
    municipalityId: Types.ObjectId;
    wardId: Types.ObjectId;
  };

  @Prop({
    type: MongooseSchema.Types.Mixed,
    required: true,
  })
  participants: MessageParticipants;

  @Prop({
    type: [MongooseSchema.Types.Mixed],
    default: [],
  })
  messages: MessageEntry[];

  @Prop({ type: Date })
  lastMessageAt: Date;

  @Prop({ type: Types.ObjectId, ref: UserEntity.name })
  assignedToOfficerId?: Types.ObjectId;

  @Prop({ type: Number, default: 0 })
  upvotesCount?: number;

  @Prop({ type: Number, default: 0 })
  downvotesCount?: number;

  @Prop({ type: Number, default: 0 })
  viewsCount?: number;

  @Prop({ type: String, unique: true })
  referenceNumber: string;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ type: Types.ObjectId, ref: 'ReportEntity' })
  sourceReportId?: Types.ObjectId;

  @Prop({
    type: String,
    enum: ['citizen_created', 'report_converted', 'report_escalated'],
  })
  messageOrigin: string;

  @Prop({ type: Boolean, default: false })
  isAnonymous: boolean;
}

export const MessageEntitySchema = SchemaFactory.createForClass(MessageEntity);
export type MessageEntityDocument = Document & MessageEntity;
