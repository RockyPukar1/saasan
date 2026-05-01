export interface IJobRecord {
  _id?: string;
  id?: string;
  jobKey: string;
  topic: string;
  jobType: string;
  status: string;
  attempts: number;
  maxAttempts: number;
  nextRetryAt?: string | null;
  processingStartedAt?: string | null;
  completedAt?: string | null;
  deadLetteredAt?: string | null;
  lastError?: string | null;
  payload: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}
