import type { Evidence, StatusUpdate } from "./index";

export interface IReport {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  upvotesCount: number;
  downvotesCount: number;
  viewsCount: number;
  referenceNumber: string;
  tags: string[];
  userVote?: string;
  isAnonymous: boolean;
  createdAt: string;
  updatedAt: string;
  evidence?: Evidence[];
  statusUpdates?: StatusUpdate[];
  sharesCount?: number;
}
