export interface IBudget {
  _id?: string;
  id?: string;
  title: string;
  description?: string;
  amount: number;
  department: string;
  year: number;
  status: string;
  category?: string;
  provinceId?: string;
  districtId?: string;
  constituencyId?: string;
  municipalityId?: string;
  wardId?: string;
  politicianId?: string;
  createdAt: string;
  updatedAt: string;
}
