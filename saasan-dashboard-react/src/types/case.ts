export interface IMajorCase {
  id: string;
  referenceNumber: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  amountInvolved: number;
  upvotesCount: number;
  downvotesCount: number;
  viewsCount: number;
  sharesCount: number;
  peopleAffectedCount: number;
  dateOccurred?: string;
  locationDescription?: string;
  provinceId?: string;
  districtId?: string;
  constituencyId?: string;
  municipalityId?: string;
  wardId?: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt?: string;
}
