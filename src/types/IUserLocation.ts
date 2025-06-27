export interface IUserLocation {
  status: "success";
  country: string;
  countryCode: string;
  region: string;
  regionName: string;
  city: string;
  zip: string;
  lat: bigint;
  lon: bigint;
  timezone: string;
}
