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
  phone: string;
  passwordHash: string;
  fullName: string;
  isAnonymousPreferred: boolean;
  citizenshipNumber: string;
  district: string;
  municipality: string;
  wardNumber: number;
  role: UserRole;
  emailVerifiedAt: Date;
  phoneVerifiedAt: Date;
  lastActiveAt: Date;
  fcmToken: string;
  createdAt: Date;
  updatedAt: Date;
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
