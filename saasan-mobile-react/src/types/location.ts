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
