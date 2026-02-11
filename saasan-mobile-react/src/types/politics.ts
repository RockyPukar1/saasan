import { PoliticianStatus } from "./index";

export { PoliticianStatus };

export interface IPolitician {
  id: string;
  fullName: string;
  biography: string;
  contact: {
    email: string;
    phone: string;
    website: string;
  };
  socialMedia: {
    facebook: string;
    twitter: string;
    instagram: string;
  };
  education: string;
  experienceYears: number;
  isIndependent: boolean;
  profession: string;
  rating: number;
  totalReports: number;
  totalVotes: number;
  verifiedReports: number;
  sourceCategories: {
    party: string;
    positions: string[];
    levels: string[];
  };
  promises: {
    id: string;
    title: string;
    description: string;
    status: string;
    dueDate: Date;
    progress: number;
  }[];
  achievements: {
    id: string;
    title: string;
    description: string;
    category: string;
    date: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IPoliticianFilter {
  level: string[];
  position: string[];
  party: string[];
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
