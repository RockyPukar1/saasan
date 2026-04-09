export interface CitizenMessage {
  id: string;
  citizenId: string;
  citizenName: string;
  citizenEmail: string;
  subject: string;
  message: string;
  category: "complaint" | "suggestion" | "question" | "request";
  urgency: "low" | "medium" | "high";
  status: "pending" | "in_progress" | "resolved" | "closed";
  assignedTo?: string;
  responseCount: number;
  lastResponseAt?: string;
  createdAt: string;
  updatedAt: string;
  jurisdiction: string;
}

export interface Politician {
  _id: string;
  fullName: string;
  age?: number;
  biography?: string;
  education?: string;
  profession?: string;
  experiences?: Experience[];
  contact: {
    phone?: string;
    email?: string;
    website?: string;
  };
  socialMedia: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
  };
  joinedDate?: string;
  totalVotes?: number;
  constituencyId?: string;
  isIndependent?: boolean;
  partyId?: string;
  positionIds?: string[];
  experienceYears?: number;
  termStartDate?: string;
  termEndDate?: string;
  photoUrl?: string;
  isActive?: boolean;
  rating?: number;
  totalReports?: number;
  verifiedReports?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Experience {
  category: string;
  title: string;
  company: string;
  startDate: string;
  endDate: string;
}

// Politician portal specific types that extend shared types
export interface PoliticianDashboard {
  politician: Politician;
  stats: {
    totalMessages: number;
    activePromises: number;
    announcements: number;
    constituentsReached: number;
  };
  recentMessages: CitizenMessage[];
  recentPromises: PromiseEntity[];
}

export type PromiseStatus = "pending" | "ongoing" | "fulfilled" | "broken";

export interface PromiseUpdate {
  id: string;
  title: string;
  description: string;
  progress: number;
  createdAt: string;
  attachments?: string[];
}

// Rename Promise to PromiseEntity to avoid conflict with JavaScript Promise
export interface PromiseEntity {
  id: string;
  title: string;
  description: string;
  category: "development" | "policy" | "social" | "economic" | "infrastructure";
  status: PromiseStatus;
  progress: number;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  evidence?: string[];
  updates?: PromiseUpdate[];
}
