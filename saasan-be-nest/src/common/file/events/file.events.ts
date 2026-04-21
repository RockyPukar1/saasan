export const FILE_EVENT_TYPES = {
  EVIDENCE_UPLOADED: 'evidence-uploaded',
} as const;

export interface EvidenceUploadedFileEvent {
  jobKey: string;
  type: typeof FILE_EVENT_TYPES.EVIDENCE_UPLOADED;
  reportId: string;
  files: Array<{
    originalName: string;
    mimeType: string;
    fileSize: number;
    fileType: string;
    filePath: string;
    cloudinaryPublicId: string;
  }>;
  retryCount?: number;
}

export interface FailedFileEvent {
  originalTopic: string;
  reason: string;
  payload: Record<string, unknown>;
  failedAt: string;
}
