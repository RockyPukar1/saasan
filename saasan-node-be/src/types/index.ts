export enum UserRole {
  CITIZEN = "citizen",
  ADMIN = "admin",
  MODERATOR = "moderator",
  INVESTIGATOR = "investigator",
}

export enum PoliticianStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  DECEASED = "deceased",
}

export enum ReportStatus {
  SUBMITTED = "submitted",
  UNDER_REVIEW = "under_review",
  VERIFIED = "verified",
  RESOLVED = "resolved",
  DISMISSED = "dismissed",
}

export enum ReportPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  URGENT = "urgent",
}

export interface User {
  id: string;
  email: string;
  phone?: string | null;
  password_hash: string;
  full_name: string;
  district?: string | null;
  municipality?: string | null;
  ward_number?: number | null;
  role: UserRole;
  last_active_at: Date;
  created_at: Date;
  updated_at: Date;
}

export interface Politician {
  id: string;
  fullName: string;
  positionId: number;
  partyId: number;
  constituencyId: number;
  biography: string;
  education: string;
  experienceYears: number;
  dateOfBirth: Date;
  profileImageUrl: string;
  contactPhone: string;
  contactEmail: string;
  officialWebsite: string;
  socialMediaLinks: Record<string, string>;
  status: PoliticianStatus;
  termStartDate: Date;
  termEndDate: Date;
  totalVotesReceived: number;
  createdAt: Date;
  updatedAt: Date;
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
  assignedToOfficerId: string;
  dateOccurred: Date;
  amountInvolved: number;
  peopleAffectedCount: number;
  publicVisibility: string;
  upvotesCount: number;
  downvotesCount: number;
  viewsCount: number;
  sharesCount: number;
  resolvedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Poll {
  id: string;
  title: string;
  title_nepali?: string;
  description: string;
  description_nepali?: string;
  type: string;
  type_nepali?: string;
  status: string;
  category: string;
  category_nepali?: string;
  start_date: string;
  end_date?: string;
  created_by: string;
  total_votes: number;
  is_anonymous: boolean;
  requires_verification: boolean;
  options: PollOption[];
  created_at: string;
  updated_at: string;
}

export interface PollOption {
  id: string;
  poll_id: string;
  text: string;
  text_nepali?: string;
  votes_count: number;
  percentage: number;
  created_at: string;
  updated_at: string;
}

export interface PollVote {
  id: string;
  poll_id: string;
  option_id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}
