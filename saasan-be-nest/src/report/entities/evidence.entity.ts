import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export enum FileTypeEnum {
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  DOCUMENT = 'document',
}

@Schema({ timestamps: true, collection: EvidenceEntity.collection })
export class EvidenceEntity {
  static readonly collection = 'report-evidences';
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;

  @Prop({ type: Types.ObjectId, required: true })
  reportId: Types.ObjectId;

  @Prop({
    type: [
      {
        id: {
          type: Types.ObjectId,
          required: true,
        },
        fileName: {
          type: String,
          required: true,
        },
        originalName: {
          type: String,
          required: true,
        },
        filePath: {
          type: String,
          required: true,
        },
        mimeType: {
          type: String,
          required: true,
        },
        fileSize: {
          type: Number,
          required: true,
        },
        fileType: {
          type: String,
          enum: FileTypeEnum,
          required: true,
        },
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
        cloudinaryPublicId: {
          type: String,
          required: true,
        },
      },
    ],
    default: [],
  })
  evidences: {
    _id: Types.ObjectId;
    fileName: string;
    originalName: string;
    filePath: string;
    mimeType: string;
    fileSize: number;
    fileType: FileTypeEnum;
    uploadedAt: Date;
    cloudinaryPublicId: string;
  }[];
}

export const EvidenceEntitySchema =
  SchemaFactory.createForClass(EvidenceEntity);
export type EvidenceEntityDocument = Document & EvidenceEntity;
