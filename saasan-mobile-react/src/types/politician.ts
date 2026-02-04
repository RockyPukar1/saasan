import { PoliticianStatus } from './index';

export { PoliticianStatus };

export interface IPoliticianDetails {
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

export interface IPoliticianFilter {
  level: string[];
  position: string[];
  party: string[];
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
  sourceCategories: {
    party: string | null;
    positions: string[] | [];
    levels: string[] | [];
  };
}

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
