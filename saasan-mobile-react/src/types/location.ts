export interface IProvince {
  id: string;
  name: string;
  capital: string;
  updatedAt: string;
  createdAt: string;
}

export interface IDistrict {
  id: string;
  name: string;
  headquarter: string;
  provinceId: string;
  updatedAt: string;
  createdAt: string;
}

export interface IConstituency {
  id: string;
  constituencyNumber: number;
  provinceId: string;
  districtId: string;
  updatedAt: string;
  createdAt: string;
}

export interface IMunicipality {
  id: string;
  name: string;
  provinceId: string;
  districtId: string;
  createdAt: string;
  updatedAt: string;
}

export interface IWard {
  id: string;
  wardNumber: string;
  provinceId: string;
  districtId: string;
  constituencyId: string;
  municipalityId: string;
  createdAt: string;
  updatedAt: string;
}