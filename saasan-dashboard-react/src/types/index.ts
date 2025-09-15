// User types
export interface User {
  id: string;
  email: string;
  phone?: string;
  full_name: string;
  role: 'citizen' | 'admin' | 'moderator' | 'investigator';
  district?: string;
  municipality?: string;
  ward_number?: number;
  last_active_at: string;
  created_at: string;
  updated_at: string;
}

// Politician types
export interface Politician {
  id: string;
  fullName: string;
  positionId: number;
  partyId: number;
  constituencyId: number;
  biography: string;
  education: string;
  experienceYears: number;
  dateOfBirth: string;
  profileImageUrl: string;
  contactPhone: string;
  contactEmail: string;
  officialWebsite: string;
  socialMediaLinks: Record<string, string>;
  status: 'active' | 'inactive' | 'deceased';
  termStartDate: string;
  termEndDate: string;
  totalVotesReceived: number;
  createdAt: string;
  updatedAt: string;
}

// Geographic hierarchy types
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

// Report types
export interface CorruptionReport {
  id: string;
  referenceNumber: string;
  title: string;
  description: string;
  categoryId: string;
  reporterId: string;
  isAnonymous: boolean;
  locationDescription?: string;
  latitude: number;
  longitude: number;
  district: string;
  municipality: string;
  ward: string;
  status: 'submitted' | 'under_review' | 'verified' | 'resolved' | 'dismissed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedToOfficerId?: string;
  dateOccurred: string;
  amountInvolved: number;
  peopleAffectedCount: number;
  publicVisibility: string;
  upvotesCount: number;
  downvotesCount: number;
  viewsCount: number;
  sharesCount: number;
  resolvedAt?: string;
  createdAt: string;
  updatedAt: string;
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

// Major cases types
export interface MajorCase {
  id: string;
  referenceNumber: string;
  title: string;
  description: string;
  status: 'unsolved' | 'ongoing' | 'solved';
  priority: 'urgent' | 'high' | 'medium' | 'low';
  amountInvolved: number;
  upvotesCount: number;
  createdAt: string;
  category_id?: number;
  reporter_id?: string;
  is_anonymous?: boolean;
  location_description?: string;
  latitude?: string;
  longitude?: string;
  district?: string;
  municipality?: string;
  ward?: string;
  assigned_to_officer_id?: string | null;
  date_occurred?: string;
  people_affected_count?: number;
  public_visibility?: string;
  downvotes_count?: number;
  views_count?: number;
  shares_count?: number;
  resolved_at?: string | null;
  updated_at?: string;
  is_public?: boolean;
}

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
export interface DashboardStats {
  overview: {
    totalReports: number;
    resolvedReports: number;
    totalPoliticians: number;
    activePoliticians: number;
    resolutionRate: number;
  };
  categoryBreakdown: Array<{
    categoryName: string;
    count: number;
  }>;
  recentActivity: MajorCase[];
}

// Upload types
export interface UploadResult {
  success: boolean;
  message: string;
  errors?: string[];
  imported?: number;
  skipped?: number;
}
