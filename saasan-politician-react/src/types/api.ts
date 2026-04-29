// API Response Types - matching backend serializers exactly

// Contact info as sent by backend
export interface ContactDto {
  email: string;
  phone: string;
  website: string;
}

// Social media as sent by backend
export interface SocialMediaDto {
  facebook: string;
  twitter: string;
  instagram: string;
}

// Source categories as sent by backend
export interface SourceCategoriesDto {
  party: string;
  positions: string[];
  levels: string[];
}

// Promise data as sent by backend
export interface PromiseDto {
  id: string;
  title: string;
  description: string;
  status: string;
  dueDate: Date;
  progress: number;
}

// Achievement data as sent by backend
export interface AchievementDto {
  id: string;
  title: string;
  description: string;
  category: string;
  date: Date;
}

// Politician data as sent by backend serializer
export interface PoliticianDto {
  id: string;
  userId?: string;
  fullName: string;
  biography: string;
  contact: ContactDto;
  socialMedia: SocialMediaDto;
  education: string;
  experienceYears: number;
  isIndependent: boolean;
  profession: string;
  rating: number;
  totalReports: number;
  totalVotes: number;
  verifiedReports: number;
  hasAccount?: boolean;
  accountCreatedAt?: string;
  sourceCategories: SourceCategoriesDto;
  promises?: PromiseDto[];
  achievements?: AchievementDto[];
  createdAt: string;
  updatedAt: string;
}

// Report source categories as sent by backend
export interface ReportSourceCategories {
  type: string;
  priority: string;
  visibility: string;
  status: string;
}

// Evidence as sent by backend
export interface EvidenceDto {
  id: string;
  originalName: string;
  filePath: string; // Cloudinary URL
  fileType: string;
  uploadedAt: string;
  cloudinaryPublicId: string;
}

// Report activity as sent by backend
export interface ReportActivityDto {
  category: string;
  modifiedBy: {
    id: string;
    fullName: string;
  };
  oldValue: any;
  newValue: any;
  modifiedAt: string;
}

// Report data as sent by backend serializer
export interface ReportDto {
  id: string;
  title: string;
  description: string;
  statusId: string;
  priorityId: string;
  visibilityId: string;
  typeId: string;
  upvotesCount: number;
  downvotesCount: number;
  viewsCount: number;
  referenceNumber: string;
  tags: string[];
  isAnonymous: boolean;
  createdAt: string;
  updatedAt: string;
  evidences?: EvidenceDto[];
  activities?: ReportActivityDto[];
  sharesCount: number;
  sourceCategories: ReportSourceCategories;
}

// User data as sent by backend (likely similar to UserEntity but serialized)
export interface UserDto {
  id: string;
  email: string;
  fullName: string;
  role: 'admin' | 'politician' | 'citizen';
  provinceId?: string;
  districtId?: string;
  municipalityId?: string;
  wardId?: string;
  constituencyId?: string;
  phone?: string;
  avatarUrl?: string;
  designation?: string;
  department?: string;
  politicianId?: string;
  profile?: Record<string, unknown>;
  isActive: boolean;
  isVerified: boolean;
  lastActiveAt?: string;
  createdAt: string;
  updatedAt: string;
}

// API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Paginated response wrapper
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Citizen message (not in backend yet, but will follow similar pattern)
export interface CitizenMessageDto {
  id: string;
  citizenId: string;
  citizenName: string;
  citizenEmail: string;
  subject: string;
  message: string;
  category: 'complaint' | 'suggestion' | 'question' | 'request';
  urgency: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'resolved' | 'closed';
  assignedTo?: string;
  responseCount: number;
  lastResponseAt?: string;
  createdAt: string;
  updatedAt: string;
  jurisdiction: string;
}

// Announcement (not in backend yet, but will follow similar pattern)
export interface AnnouncementDto {
  id: string;
  title: string;
  content: string;
  type: 'notice' | 'update' | 'achievement' | 'meeting';
  priority: 'low' | 'medium' | 'high';
  isPublic: boolean;
  scheduledAt?: string;
  publishedAt?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}
