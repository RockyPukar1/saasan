import { ReportStatus, ReportPriority } from "./index";

export { ReportStatus, ReportPriority };

export interface Evidence {
  id: string;
  url: string;
  type: "image" | "document" | "video";
  uploadedAt: string;
  description?: string;
}

export interface CorruptionReport {
  id: string;
  referenceNumber: string;
  title: string;
  description: string;
  categoryId: string;
  reporterId: string;
  isAnonymous: boolean;
  locationDescription?: string;
  latitude: number;
  longitude: number;
  district: string;
  municipality: string;
  ward: string;
  status: ReportStatus;
  priority: ReportPriority;
  assignedToOfficerId?: string;
  dateOccurred: Date | string;
  amountInvolved: number;
  peopleAffectedCount: number;
  publicVisibility: string;
  upvotesCount: number;
  downvotesCount: number;
  viewsCount: number;
  sharesCount: number;
  resolvedAt?: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;
  evidence?: Evidence[];
  user_vote?: "up" | "down";
  status_updates?: Array<{
    status: string;
    comment: string;
    created_at: string;
  }>;
}

export interface MajorCase {
  id: string;
  referenceNumber: string;
  title: string;
  description: string;
  status: "unsolved" | "ongoing" | "solved";
  priority: "urgent" | "high" | "medium" | "low";
  amountInvolved: number;
  upvotesCount: number;
  createdAt: string;
  category_id?: number;
  reporter_id?: string;
  is_anonymous?: boolean;
  location_description?: string;
  latitude?: string;
  longitude?: string;
  district?: string;
  municipality?: string;
  ward?: string;
  assigned_to_officer_id?: string | null;
  date_occurred?: string;
  people_affected_count?: number;
  public_visibility?: string;
  downvotes_count?: number;
  views_count?: number;
  shares_count?: number;
  resolved_at?: string | null;
  updated_at?: string;
  is_public?: boolean;
}

export interface ReportCreateData {
  title: string;
  description: string;
  location: string;
  category: string;
  evidence?: File[];
}

export interface ReportUpdateData {
  status: ReportStatus;
  assignedTo?: string;
}

export interface ReportFilters {
  status?: string;
  category?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  location?: string;
}
