export interface CorruptionReport {
  id: string;
  title: string;
  description: string;
  location: string;
  category: string;
  status: "submitted" | "under_review" | "verified" | "resolved" | "dismissed";
  evidence?: Evidence[];
  upvotes_count: number;
  downvotes_count: number;
  shares_count: number;
  user_vote?: "up" | "down";
  created_at: string;
  updated_at: string;
  reporter_id: string;
  assigned_to_officer_id?: string;
  is_anonymous: boolean;
  status_updates?: Array<{
    status: string;
    comment: string;
    created_at: string;
  }>;
}

export interface Evidence {
  id: string;
  url: string;
  type: "image" | "document" | "video";
  uploadedAt: string;
  description?: string;
}

export interface ReportCreateData {
  title: string;
  description: string;
  location: string;
  category: string;
  evidence?: File[];
}

export interface ReportUpdateData {
  status: CorruptionReport["status"];
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
