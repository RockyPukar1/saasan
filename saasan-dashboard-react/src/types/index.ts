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
    totalReportsCount: number;
    resolvedReportsCount: number;
    totalCasesCount: number;
    resolvedCasesCount: number;
    totalPoliticians: number;
    activePoliticians: number;
    reportResolutionRate: number;
    caseResolutionRate: number;
  };
  aggregations?: {
    reportLevelBreakdown: Array<{
      label: string;
      count: number;
    }>;
    reportStatusBreakdown: Array<{
      label: string;
      count: number;
    }>;
    reportVolumeTrend: Array<{
      date: string;
      count: number;
    }>;
    caseVolumeTrend: Array<{
      date: string;
      count: number;
    }>;
    combinedVolumeTrend: Array<{
      date: string;
      reports: number;
      cases: number;
      total: number;
    }>;
    eventCategoryBreakdown: Array<{
      label: string;
      count: number;
    }>;
  };
  recentReports: any[];
  recentCases: any[];
  recentEvents: any[];
  eventsOnThisDay: any[];
}

// Service types
export interface IServiceStatus {
  id: string;
  serviceType: string;
  status: string;
}
