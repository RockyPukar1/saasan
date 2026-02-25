export interface Evidence {
  id: string;
  originalName: string;
  filePath: string;
  fileType: "image" | "document" | "video" | "audio";
  uploadedAt: string;
  cloudinaryPublicId: string;
}

export interface ReportActivity {
  category: string;
  modifiedBy: {
    id: string;
    fullName: string;
  };
  oldValue?: string;
  newValue: string;
  modifiedAt: string;
}
export interface IReport {
  id: string;
  title: string;
  description: string;
  statusId?: string;
  priorityId?: string;
  visibilityId?: string;
  typeId?: string;
  comment?: string;
  upvotesCount: number;
  downvotesCount: number;
  viewsCount: number;
  referenceNumber: string;
  tags: string[];
  userVote?: string;
  isAnonymous: boolean;
  createdAt: string;
  updatedAt: string;
  sharesCount?: number;
  reporterId?: string;
  locationDescription?: string;
  latitude?: number;
  longitude?: number;
  district?: string;
  municipality?: string;
  ward?: string;
  assignedToOfficerId?: string;
  dateOccurred?: string | Date;
  amountInvolved?: number;
  peopleAffectedCount?: number;
  resolvedAt?: string | Date;
  sourceCategories: {
    type: string;
    visibility: string;
    priority: string;
    status: string;
  };
  evidences?: Evidence[];
  activities?: ReportActivity[];
}

export interface IReportPriority {
  id: string;
  title: string;
  description: string;

  createdAt: string;
  updatedAt: string;
}

export interface IReportType {
  id: string;
  title: string;
  description: string;

  createdAt: string;
  updatedAt: string;
}

export interface IReportVisibility {
  id: string;
  title: string;
  description: string;

  createdAt: string;
  updatedAt: string;
}

export interface IReportStatus {
  id: string;
  title: string;
  description: string;

  createdAt: string;
  updatedAt: string;
}
