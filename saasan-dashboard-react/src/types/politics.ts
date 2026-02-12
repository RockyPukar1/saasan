export interface IGovernmentLevel {
  id: string;
  name: string;
  description: string;
  count: number;
}

export interface IParty {
  id: string;
  name: string;
  abbreviation: string;
  ideology?: string;
  foundedIn: Date;
  logoUrl?: string;
  color: string;
  count: number;
}
export interface IPosition {
  id: string;
  name: string;
  description: string;
  abbreviation: string;
  count: number;
}

export interface IPolitician {
  id: string;
  fullName: string;
  party: string;
  experienceYears: number;
  createdAt: Date;
  updatedAt: Date;
  isIndependent: boolean;
  rating: number;
  totalReports: number;
  verifiedReports: number;
  constituencyNumber?: string;
  biography?: string;
  education?: string;
  profession?: string;
  experiences?: {
    category: string;
    title: string;
    company: string;
    startDate: Date;
    endDate: Date;
  }[];
  partyId?: string;
  positionId?: string;
  constituencyId?: string;
  status?: "active" | "inactive" | "deceased";
  contact?: {
    email?: string;
    phone?: string;
    website?: string;
  };
  age?: number;
  totalVotes?: number;
  isActive?: boolean;
  joinedDate?: Date;
  photoUrl?: string;
  dateOfBirth?: string;
  totalVotesReceived?: number;
  termStartDate?: string;
  termEndDate?: string;
  profileImageUrl?: string;
  officialWebsite?: string;
  sourceCategories: {
    party: string | null;
    positions: string[] | [];
    levels: string[] | [];
  };
  socialMedia?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
  };
  promises?: {
    title: string;
    description: string;
    status: "ongoing" | "fulfilled" | "broken" | "not-started" | "in-progress";
    dueDate: string;
    progress: number;
  }[];
  achievements?: {
    title: string;
    description: string;
    category: "policy" | "development" | "social" | "economic" | "economy";
    date: Date;
  }[];
}
