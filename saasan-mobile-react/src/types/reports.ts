export interface IReport {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  upvotesCount: number;
  downvotesCount: number;
  viewsCount: number;
  referenceNumber: number;
  tags: string[];
  userVote: string;
  isAnonymous: boolean;
  createdAt: string;
  updatedAt: string;
}
