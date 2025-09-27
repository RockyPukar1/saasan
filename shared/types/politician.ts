import { PoliticianStatus } from './index';

export { PoliticianStatus };

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
  type: 'metropolitan' | 'sub_metropolitan' | 'municipality' | 'rural_municipality';
}

export interface Ward {
  id: string;
  number: number;
  municipalityId: string;
  name?: string;
}
