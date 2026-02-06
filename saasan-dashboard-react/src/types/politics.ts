
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
  sourceCategories: {
    party: string | null;
    positions: string[] | [];
    levels: string[] | [];
  };
}
