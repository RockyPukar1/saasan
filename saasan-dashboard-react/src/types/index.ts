export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ExpressRequest {
  user: {
    userId: string;
    email: string;
    role: string;
  };
}


export interface ICategoryStat {
  categoryName: string;
  count: number;
}

export interface IDashboardStats {
  overview: {
    totalReports: number;
    resolvedReports: number;
    totalPoliticians: number;
    activePoliticians: number;
    resolutionRate: number;
  };
  categoryBreakdown: ICategoryStat[];
  recentActivity: import("./case").IMajorCase[];
}

// Service types
export interface IServiceStatus {
  id: string;
  serviceType: string;
  status: string;
}