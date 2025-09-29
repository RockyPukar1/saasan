// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Dashboard stats types
export interface CategoryStat {
  categoryName: string;
  count: number;
}

export interface DashboardStats {
  overview: {
    totalReports: number;
    resolvedReports: number;
    totalPoliticians: number;
    activePoliticians: number;
    resolutionRate: number;
  };
  categoryBreakdown: CategoryStat[];
  recentActivity: import('./reports').MajorCase[];
}

// Service types
export interface ServiceStatus {
  id: string;
  serviceType: string;
  status: "online" | "offline";
}

// Upload types
export interface UploadResult {
  success: boolean;
  message: string;
  errors?: string[];
  imported?: number;
  skipped?: number;
}

// Historical events types
export interface HistoricalEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  year: number;
  category: 'corruption' | 'political' | 'social' | 'economic';
  significance: 'high' | 'medium' | 'low';
  createdAt: string;
  updatedAt: string;
}

// Mobile-specific types
export type MediaFile = {
  uri: string;
  type?: string;
  name?: string;
  mimeType?: string;
  size?: number;
};

export type MediaPickerResult = MediaFile;
