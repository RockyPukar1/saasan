import { Expose, Transform, Type } from 'class-transformer';

class MessageThreadParticipantSerializer {
  @Expose()
  @Transform(({ value }) => value?.toString?.() || value)
  id: string;

  @Expose() name: string;
  @Expose() email?: string;
  @Expose() role?: string;
  @Expose() location?: Record<string, string>;
}

class MessageAttachmentSerializer {
  @Expose()
  @Transform(({ obj }) => obj._id?.toString?.() || obj.id)
  id: string;

  @Expose() fileName: string;
  @Expose() fileType: string;
  @Expose() fileUrl: string;
  @Expose()
  @Transform(({ value }) => value?.toString?.() || value)
  uploadedBy: string;
  @Expose() uploadedAt?: Date;
}

class MessageEntrySerializer {
  @Expose()
  @Transform(({ obj }) => obj._id?.toString?.() || obj.id)
  id: string;

  @Expose()
  @Transform(({ value }) => value?.toString?.() || value)
  senderId: string;

  @Expose() senderType: string;
  @Expose() content: string;
  @Expose() isInternal?: boolean;
  @Expose() createdAt?: Date;
  @Expose() readAt?: Date;

  @Expose()
  @Type(() => MessageAttachmentSerializer)
  attachments?: MessageAttachmentSerializer[];
}

class MessageParticipantsSerializer {
  @Expose()
  @Type(() => MessageThreadParticipantSerializer)
  citizen: MessageThreadParticipantSerializer;

  @Expose()
  @Type(() => MessageThreadParticipantSerializer)
  politician: MessageThreadParticipantSerializer;

  @Expose()
  @Type(() => MessageThreadParticipantSerializer)
  politicians?: MessageThreadParticipantSerializer[];

  @Expose()
  @Type(() => MessageThreadParticipantSerializer)
  assignedStaff?: MessageThreadParticipantSerializer[];
}

export class MessageThreadSerializer {
  @Expose()
  @Transform(({ obj }) => obj._id?.toString?.() || obj.id)
  id: string;

  @Expose() subject: string;
  @Expose() content: string;
  @Expose() category: string;
  @Expose() urgency: string;
  @Expose() status: string;
  @Expose() referenceNumber?: string;
  @Expose() tags?: string[];
  @Expose() isAnonymous?: boolean;

  @Expose()
  @Transform(({ value }) => value?.toString?.() || value || null)
  sourceReportId?: string | null;

  @Expose() messageOrigin?: string;
  @Expose() createdAt: Date;
  @Expose() updatedAt: Date;
  @Expose() lastMessageAt?: Date;

  @Expose()
  @Type(() => MessageParticipantsSerializer)
  participants: MessageParticipantsSerializer;

  @Expose()
  @Type(() => MessageEntrySerializer)
  messages: MessageEntrySerializer[];
}
