export const EMAIL_EVENT_TYPES = {
  POLITICIAN_ACCOUNT_CREATED: 'politician-account-created',
};

export interface PoliticianAccountCreatedEmailEvent {
  jobKey: string;
  type: typeof EMAIL_EVENT_TYPES.POLITICIAN_ACCOUNT_CREATED;
  to: string;
  politicianName: string;
  password: string;
  retryCount?: number;
}

export interface FailedEmailEvent {
  originalTopic: string;
  reason: string;
  payload: Record<string, unknown>;
  failedAt: string;
}
