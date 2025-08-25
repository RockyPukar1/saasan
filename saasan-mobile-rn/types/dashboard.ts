export interface DashboardStats {
  overview: {
    totalReports: number;
    resolvedReports: number;
    totalPoliticians: number;
    activePoliticians: number;
    resolutionRate: number;
  };
  recentActivity: CorruptionReport[];
  categoryBreakdown: CategoryStat[];
  districtBreakdown: DistrictStat[];
}

export interface CorruptionReport {}

export interface CategoryStat {
  categoryName: string;
  count: number;
}

export interface DistrictStat {}

export interface ServiceStatus {
  id: string;
  serviceType: string; // "electricity" | "water" | "internet" | "ward_office";
  locationType: "ward" | "municipality" | "district";
  locationId: string;
  status: string; // "online" | "offline" | "partial";
  lastUpdatedAt: string;
  district: string;
  municipality: string;
  ward: string;
}

export interface MajorCase {
  id: string;
  referenceNumber: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  amountInvolved: number;
  upvotesCount: number;
  createdAt: string;
  // categoryName: string;
}
