// Base location interfaces following the pattern from reports.ts

export interface IProvince {
  id: string;
  name: string;
  provinceNumber: number;
  capital: string;
  createdAt: string;
  updatedAt: string;
}

export interface IDistrict {
  id: string;
  name: string;
  headquarter: string;
  provinceId: string;
  createdAt: string;
  updatedAt: string;
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
  wardNumber: number;
  provinceId: string;
  districtId: string;
  constituencyId: string;
  municipalityId: string;
  createdAt: string;
  updatedAt: string;
}

export interface IConstituency {
  id: string;
  constituencyNumber: number;
  provinceId: string;
  districtId: string;
  createdAt: string;
  updatedAt: string;
}

// Create interfaces for form data
export interface ICreateProvince {
  name: string;
  provinceNumber: number;
  capital: string;
}

export interface ICreateDistrict {
  name: string;
  headquarter: string;
  provinceId: string;
}

export interface ICreateMunicipality {
  name: string;
  provinceId: string;
  districtId: string;
}

export interface ICreateWard {
  wardNumber: number;
  provinceId: string;
  districtId: string;
  constituencyId: string;
  municipalityId: string;
}

export interface ICreateConstituency {
  constituencyNumber: number;
  provinceId: string;
  districtId: string;
}

// Update interfaces
export interface IUpdateProvince {
  name?: string;
  capital?: string;
}

export interface IUpdateDistrict {
  name?: string;
  headquarter?: string;
}

export interface IUpdateMunicipality {
  name?: string;
}

export interface IUpdateWard {
  wardNumber?: number;
}

export interface IUpdateConstituency {
  constituencyNumber?: number;
}

// Filter interfaces
export interface IProvinceFilter {
  name?: string;
  capital?: string;
  provinceNumber?: number;
}

export interface IDistrictFilter {
  name?: string;
  headquarter?: string;
  provinceId?: string;
}

export interface IMunicipalityFilter {
  name?: string;
  provinceId?: string;
  districtId?: string;
}

export interface IWardFilter {
  wardNumber?: number;
  provinceId?: string;
  districtId?: string;
  constituencyId?: string;
  municipalityId?: string;
}

export interface IConstituencyFilter {
  constituencyNumber?: number;
  provinceId?: string;
  districtId?: string;
}

// Geographic hierarchy response interfaces
export interface IGeographicHierarchy {
  provinces: IProvince[];
  districts: IDistrict[];
  municipalities: IMunicipality[];
  wards: IWard[];
  constituencies: IConstituency[];
}

export interface IProvinceWithChildren extends IProvince {
  districts: IDistrict[];
  municipalities: IMunicipality[];
  wards: IWard[];
  constituencies: IConstituency[];
}

export interface IDistrictWithChildren extends IDistrict {
  municipalities: IMunicipality[];
  wards: IWard[];
  constituencies: IConstituency[];
}

export interface IMunicipalityWithChildren extends IMunicipality {
  wards: IWard[];
}

// Location statistics interfaces
export interface ILocationStats {
  totalProvinces: number;
  totalDistricts: number;
  totalMunicipalities: number;
  totalWards: number;
  totalConstituencies: number;
}

export interface IProvinceStats {
  province: IProvince;
  districtCount: number;
  municipalityCount: number;
  wardCount: number;
  constituencyCount: number;
}

// Search and pagination interfaces
export interface ILocationSearch {
  query: string;
  type?: "province" | "district" | "municipality" | "ward" | "constituency";
  provinceId?: string;
  districtId?: string;
  municipalityId?: string;
}

export interface ILocationSearchResult {
  provinces: IProvince[];
  districts: IDistrict[];
  municipalities: IMunicipality[];
  wards: IWard[];
  constituencies: IConstituency[];
  total: number;
}

// Validation error interfaces
export interface ILocationValidationError {
  field: string;
  message: string;
}

export interface ILocationValidationErrors {
  [key: string]: ILocationValidationError[];
}

// Bulk upload interfaces
export interface ILocationBulkUpload {
  file: File;
  type: "district" | "municipality" | "ward" | "constituency";
}

export interface ILocationBulkUploadResult {
  success: boolean;
  imported: number;
  failed: number;
  errors: string[];
  duplicates: string[];
}

// Location coordinates interface
export interface ILocationCoordinates {
  latitude: number;
  longitude: number;
}

export interface ILocationWithCoordinates extends ILocationCoordinates {
  province?: string;
  district?: string;
  municipality?: string;
  ward?: string;
}

// Generic location interface for common properties
export interface ILocation {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}
