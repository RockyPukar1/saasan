import { NotificationRecipientType } from '../entities/notification.entity';

export const NOTIFICATION_EVENT_TYPES = {
  MESSAGE_CREATED: 'message-created',
  MESSAGE_REPLY_ADDED: 'message-reply-added',
};

export interface NotificationEventPayload {
  jobKey: string;
  type:
    | typeof NOTIFICATION_EVENT_TYPES.MESSAGE_CREATED
    | typeof NOTIFICATION_EVENT_TYPES.MESSAGE_REPLY_ADDED;
  recipientId: string;
  recipientType: NotificationRecipientType;
  title: string;
  body: string;
  metadata?: Record<string, any>;
  retryCount?: number;
}
