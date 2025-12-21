// Core types and enums
export const UserRole = {
  CITIZEN: "citizen",
  ADMIN: "admin",
  MODERATOR: "moderator",
  INVESTIGATOR: "investigator",
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const PoliticianStatus = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  DECEASED: "deceased",
} as const;

export type PoliticianStatus =
  (typeof PoliticianStatus)[keyof typeof PoliticianStatus];

export const GovernmentLevel = {
  NATIONAL: "national",
  PROVINCE: "province",
  DISTRICT: "district",
  MUNICIPALITY: "municipality",
  WARD: "ward",
} as const;

export type GovernmentLevel =
  (typeof GovernmentLevel)[keyof typeof GovernmentLevel];

export const ReportStatus = {
  SUBMITTED: "submitted",
  UNDER_REVIEW: "under_review",
  VERIFIED: "verified",
  RESOLVED: "resolved",
  DISMISSED: "dismissed",
} as const;

export type ReportStatus = (typeof ReportStatus)[keyof typeof ReportStatus];

export const ReportPriority = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
  URGENT: "urgent",
} as const;

export type ReportPriority =
  (typeof ReportPriority)[keyof typeof ReportPriority];

export const PollStatus = {
  ACTIVE: "active",
  ENDED: "ended",
  DRAFT: "draft",
} as const;

export type PollStatus = (typeof PollStatus)[keyof typeof PollStatus];

export const PollType = {
  SINGLE_CHOICE: "single_choice",
  MULTIPLE_CHOICE: "multiple_choice",
  RATING: "rating",
} as const;

export type PollType = (typeof PollType)[keyof typeof PollType];

export const PollCategory = {
  GENERAL: "general",
  POLITICAL: "political",
  SOCIAL: "social",
  ECONOMIC: "economic",
  EDUCATION: "education",
  HEALTH: "health",
  ENVIRONMENT: "environment",
} as const;

export type PollCategory = (typeof PollCategory)[keyof typeof PollCategory];

// User types
export interface User {
  id: string;
  email: string;
  phone: string | null;
  password_hash: string;
  full_name: string;
  district?: string | null;
  municipality?: string | null;
  ward_number?: number | null;
  role: UserRole;
  last_active_at: Date | string;
  created_at: Date | string;
  updated_at: Date | string;
}

// Politician types
export interface Politician {
  id: string;
  fullName: string;
  positionId: number;
  partyId: number;
  constituencyId: number;
  biography: string;
  education: string;
  experienceYears: number;
  dateOfBirth: Date | string;
  profileImageUrl: string;
  contactPhone: string;
  contactEmail: string;
  officialWebsite: string;
  socialMediaLinks: Record<string, string>;
  status: PoliticianStatus;
  termStartDate: Date | string;
  termEndDate: Date | string;
  totalVotesReceived: number;
  createdAt: Date | string;
  updatedAt: Date | string;
}

// Geographic hierarchy types
export interface District {
  id: string;
  name: string;
  provinceId: number;
}

export interface Municipality {
  id: string;
  name: string;
  districtId: string;
  type:
    | "metropolitan"
    | "sub_metropolitan"
    | "municipality"
    | "rural_municipality";
}

export interface Ward {
  id: string;
  number: number;
  municipalityId: string;
  name?: string;
}

// Report types
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

// Historical events types
export interface HistoricalEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  year: number;
  category: "corruption" | "political" | "social" | "economic";
  significance: "high" | "medium" | "low";
  createdAt: string;
  updatedAt: string;
}

// Major cases types
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

// Poll types
export interface PollOption {
  _id: string;
  poll_id?: string;
  text: string;
  text_nepali?: string;
  votesCount: number;
  percentage: number;
  created_at?: string;
  updated_at?: string;
}

export interface Poll {
  _id: string;
  title: string;
  title_nepali?: string;
  description: string;
  description_nepali?: string;
  type: PollType;
  type_nepali?: string;
  status: PollStatus;
  status_nepali?: string;
  category: PollCategory;
  category_nepali?: string;
  startDate: string;
  endDate?: string;
  createdBy?: string;
  totalVotes: number;
  requiresVerification: boolean;
  options: PollOption[];
  createdAt: string;
  updatedAt: string;
  user_vote?: string | string[];
  district?: string;
  municipality?: string;
  ward?: string;
  politician_id?: string;
  party_id?: string;
}

export interface PollVote {
  id?: string;
  poll_id: string;
  option_id: string | string[];
  user_id: string;
  created_at: string;
  updated_at?: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Dashboard stats types
export interface CategoryStat {
  categoryName: string;
  count: number;
}

export interface DashboardStats {
  overview: {
    totalReports: number;
    resolvedReports: number;
    totalPoliticians: number;
    activePoliticians: number;
    resolutionRate: number;
  };
  categoryBreakdown: CategoryStat[];
  recentActivity: MajorCase[];
}

// Service types
export interface ServiceStatus {
  id: string;
  serviceType: string;
  status: "online" | "offline";
}

// Upload types
export interface UploadResult {
  success: boolean;
  message: string;
  errors?: string[];
  imported?: number;
  skipped?: number;
}

// Express types (for backend only)
export interface ExpressRequest {
  user: {
    userId: string;
    email: string;
    role: string;
  };
}

// Mobile-specific types
export type MediaFile = {
  uri: string;
  type?: string;
  name?: string;
  mimeType?: string;
  size?: number;
};

export type MediaPickerResult = MediaFile;

// Poll-specific interfaces
export interface PollFilters {
  status?: PollStatus;
  category?: string;
  district?: string;
  municipality?: string;
  ward?: string;
  search?: string;
  limit?: number;
  offset?: number;
  politician_id?: string;
  party_id?: string;
}

export interface CreatePollData {
  title: string;
  title_nepali?: string;
  description: string;
  description_nepali?: string;
  type: PollType;
  type_nepali?: string;
  options: string[];
  options_nepali?: string[];
  category: PollCategory;
  category_nepali?: string;
  status: PollStatus;
  status_nepali?: string;
  end_date: string;
  is_anonymous: boolean;
  requires_verification: boolean;
}

export interface UpdatePollData {
  title?: string;
  title_nepali?: string;
  description?: string;
  description_nepali?: string;
  status?: PollStatus;
  status_nepali?: string;
  end_date?: string;
  is_anonymous?: boolean;
  requires_verification?: boolean;
}

export interface PollAnalytics {
  total_polls: number;
  active_polls: number;
  total_votes: number;
  participation_rate: number;
  category_breakdown: { category: string; count: number; percentage: number }[];
  district_breakdown: { district: string; count: number; percentage: number }[];
  politician_performance: {
    politician_id: string;
    politician_name: string;
    polls_created: number;
    total_votes_received: number;
    average_rating: number;
  }[];
  party_performance: {
    party_id: string;
    party_name: string;
    polls_created: number;
    total_votes_received: number;
    average_rating: number;
  }[];
}

export interface PollComparison {
  poll_id: string;
  poll_title: string;
  politician_comparison: {
    politician_id: string;
    politician_name: string;
    votes_received: number;
    percentage: number;
  }[];
  party_comparison: {
    party_id: string;
    party_name: string;
    votes_received: number;
    percentage: number;
  }[];
}

// Report-specific interfaces
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
