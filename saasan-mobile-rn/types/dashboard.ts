export interface DashboardStats {
  overview: {
    totalReports: number;
    resolvedReports: number;
    totalPoliticians: number;
    activePoliticians: number;
    resolutionRate: number;
  };
  categoryBreakdown: CategoryStat[];
}

export interface CategoryStat {
  categoryName: string;
  count: number;
}

export interface ServiceStatus {
  id: string;
  serviceType: string;
  status: "online" | "offline";
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
  // Additional fields from backend
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
