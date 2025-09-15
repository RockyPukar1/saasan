import axios from "axios";
import type {
  ApiResponse,
  User,
  Politician,
  District,
  Municipality,
  Ward,
  CorruptionReport,
  HistoricalEvent,
  MajorCase,
  DashboardStats,
  PaginatedResponse,
  UploadResult,
} from "../types/index";
import type {
  Poll,
  PollFilters,
  CreatePollData,
  UpdatePollData,
  PollAnalytics,
  PollComparison,
} from "../types/polling";

// Utility function to transform snake_case to camelCase
const transformPolitician = (data: any): Politician => ({
  id: data.id,
  fullName: data.full_name || data.fullName,
  positionId: data.position_id || data.positionId,
  partyId: data.party_id || data.partyId,
  constituencyId: data.constituency_id || data.constituencyId,
  biography: data.biography,
  education: data.education,
  experienceYears: data.experience_years || data.experienceYears,
  dateOfBirth: data.date_of_birth || data.dateOfBirth,
  profileImageUrl: data.profile_image_url || data.profileImageUrl,
  contactPhone: data.contact_phone || data.contactPhone,
  contactEmail: data.contact_email || data.contactEmail,
  officialWebsite: data.official_website || data.officialWebsite,
  socialMediaLinks: data.social_media_links || data.socialMediaLinks || {},
  status: data.status,
  termStartDate: data.term_start_date || data.termStartDate,
  termEndDate: data.term_end_date || data.termEndDate,
  totalVotesReceived: data.total_votes_received || data.totalVotesReceived,
  createdAt: data.created_at || data.createdAt,
  updatedAt: data.updated_at || data.updatedAt,
});

// Utility function to transform camelCase to snake_case for API requests
const transformPoliticianForApi = (data: Partial<Politician>): any => ({
  full_name: data.fullName,
  position_id: data.positionId,
  party_id: data.partyId,
  constituency_id: data.constituencyId,
  biography: data.biography,
  education: data.education,
  experience_years: data.experienceYears,
  date_of_birth: data.dateOfBirth,
  profile_image_url: data.profileImageUrl,
  contact_phone: data.contactPhone,
  contact_email: data.contactEmail,
  official_website: data.officialWebsite,
  social_media_links: data.socialMediaLinks,
  status: data.status,
  term_start_date: data.termStartDate,
  term_end_date: data.termEndDate,
  total_votes_received: data.totalVotesReceived,
});

// Utility function to transform report data from snake_case to camelCase
const transformReport = (data: any): CorruptionReport => ({
  id: data.id,
  referenceNumber: data.reference_number || data.referenceNumber,
  title: data.title,
  description: data.description,
  categoryId: data.category_id || data.categoryId,
  reporterId: data.reporter_id || data.reporterId,
  isAnonymous: data.is_anonymous || data.isAnonymous,
  locationDescription: data.location_description || data.locationDescription,
  latitude: data.latitude,
  longitude: data.longitude,
  district: data.district,
  municipality: data.municipality,
  ward: data.ward,
  status: data.status,
  priority: data.priority,
  assignedToOfficerId: data.assigned_to_officer_id || data.assignedToOfficerId,
  dateOccurred: data.date_occurred || data.dateOccurred,
  amountInvolved: data.amount_involved || data.amountInvolved,
  peopleAffectedCount: data.people_affected_count || data.peopleAffectedCount,
  publicVisibility: data.public_visibility || data.publicVisibility,
  upvotesCount: data.upvotes_count || data.upvotesCount,
  downvotesCount: data.downvotes_count || data.downvotesCount,
  viewsCount: data.views_count || data.viewsCount,
  sharesCount: data.shares_count || data.sharesCount,
  resolvedAt: data.resolved_at || data.resolvedAt,
  createdAt: data.created_at || data.createdAt,
  updatedAt: data.updated_at || data.updatedAt,
});

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("auth_token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: async (
    email: string,
    password: string
  ): Promise<ApiResponse<{ token: string; user: User }>> => {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  },

  register: async (userData: {
    email: string;
    password: string;
    fullName: string;
    phone?: string;
    district?: string;
    municipality?: string;
    wardNumber?: number;
  }): Promise<ApiResponse<{ token: string; user: User }>> => {
    const response = await api.post("/auth/register", userData);
    return response.data;
  },

  getProfile: async (): Promise<ApiResponse<User>> => {
    const response = await api.get("/auth/profile");
    return response.data;
  },

  logout: () => {
    localStorage.removeItem("auth_token");
  },
};

// Dashboard API
export const dashboardApi = {
  getStats: async (): Promise<ApiResponse<DashboardStats>> => {
    const response = await api.get("/dashboard/stats");
    return response.data;
  },

  getMajorCases: async (): Promise<ApiResponse<MajorCase[]>> => {
    const response = await api.get("/dashboard/major-cases");
    return response.data;
  },

  getLiveServices: async (): Promise<ApiResponse<any[]>> => {
    const response = await api.get("/dashboard/live-services");
    return response.data;
  },
};

// Politicians API
export const politiciansApi = {
  getAll: async (params?: {
    district?: string;
    municipality?: string;
    partyId?: number;
    positionId?: number;
    status?: string;
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<PaginatedResponse<Politician>> => {
    const response = await api.get("/politicians", { params });
    const transformedData = response.data.data?.map(transformPolitician) || [];
    return {
      ...response.data,
      data: transformedData,
    };
  },

  getById: async (id: string): Promise<ApiResponse<Politician>> => {
    const response = await api.get(`/politicians/${id}`);
    return {
      ...response.data,
      data: transformPolitician(response.data.data),
    };
  },

  getByLevel: async (
    level: string,
    params?: any
  ): Promise<PaginatedResponse<Politician>> => {
    const response = await api.get(`/politicians/level/${level}`, { params });
    const transformedData = response.data.data?.map(transformPolitician) || [];
    return {
      ...response.data,
      data: transformedData,
    };
  },

  getGovernmentLevels: async (): Promise<ApiResponse<any[]>> => {
    const response = await api.get("/politicians/levels");
    return response.data;
  },

  create: async (
    politicianData: Partial<Politician>
  ): Promise<ApiResponse<Politician>> => {
    const transformedData = transformPoliticianForApi(politicianData);
    const response = await api.post("/politicians", transformedData);
    return {
      ...response.data,
      data: transformPolitician(response.data.data),
    };
  },

  update: async (
    id: string,
    politicianData: Partial<Politician>
  ): Promise<ApiResponse<Politician>> => {
    const transformedData = transformPoliticianForApi(politicianData);
    const response = await api.put(`/politicians/${id}`, transformedData);
    return {
      ...response.data,
      data: transformPolitician(response.data.data),
    };
  },

  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/politicians/${id}`);
    return response.data;
  },

  bulkUpload: async (file: File): Promise<ApiResponse<UploadResult>> => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post("/politicians/bulk-upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
};

// Geographic API
export const geographicApi = {
  getDistricts: async (): Promise<ApiResponse<District[]>> => {
    const response = await api.get("/locations/districts");
    return response.data;
  },

  getMunicipalities: async (
    districtId: string
  ): Promise<ApiResponse<Municipality[]>> => {
    const response = await api.get(
      `/locations/districts/${districtId}/municipalities`
    );
    return response.data;
  },

  getWards: async (
    districtId: string,
    municipalityId: string
  ): Promise<ApiResponse<Ward[]>> => {
    const response = await api.get(
      `/locations/districts/${districtId}/municipalities/${municipalityId}/wards`
    );
    return response.data;
  },

  createDistrict: async (
    districtData: Partial<District>
  ): Promise<ApiResponse<District>> => {
    const response = await api.post("/locations/districts", districtData);
    return response.data;
  },

  createMunicipality: async (
    municipalityData: Partial<Municipality>
  ): Promise<ApiResponse<Municipality>> => {
    const response = await api.post(
      "/locations/municipalities",
      municipalityData
    );
    return response.data;
  },

  createWard: async (wardData: Partial<Ward>): Promise<ApiResponse<Ward>> => {
    const response = await api.post("/locations/wards", wardData);
    return response.data;
  },

  bulkUploadDistricts: async (
    file: File
  ): Promise<ApiResponse<UploadResult>> => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post(
      "/locations/districts/bulk-upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  bulkUploadMunicipalities: async (
    file: File
  ): Promise<ApiResponse<UploadResult>> => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post(
      "/locations/municipalities/bulk-upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  bulkUploadWards: async (file: File): Promise<ApiResponse<UploadResult>> => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post("/locations/wards/bulk-upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
};

// Reports API
export const reportsApi = {
  getAll: async (params?: {
    status?: string;
    category?: string;
    district?: string;
    municipality?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<CorruptionReport>> => {
    const response = await api.get("/reports", { params });
    return {
      ...response.data,
      data: response.data.data?.map(transformReport) || [],
    };
  },

  getById: async (id: string): Promise<ApiResponse<CorruptionReport>> => {
    const response = await api.get(`/reports/${id}`);
    return {
      ...response.data,
      data: transformReport(response.data.data),
    };
  },

  updateStatus: async (
    id: string,
    status: string,
    comment?: string
  ): Promise<ApiResponse<CorruptionReport>> => {
    const response = await api.put(`/reports/${id}/status`, {
      status,
      comment,
    });
    return {
      ...response.data,
      data: transformReport(response.data.data),
    };
  },

  approve: async (
    id: string,
    comment?: string
  ): Promise<ApiResponse<CorruptionReport>> => {
    return reportsApi.updateStatus(id, "verified", comment);
  },

  reject: async (
    id: string,
    comment?: string
  ): Promise<ApiResponse<CorruptionReport>> => {
    return reportsApi.updateStatus(id, "dismissed", comment);
  },

  resolve: async (
    id: string,
    comment?: string
  ): Promise<ApiResponse<CorruptionReport>> => {
    return reportsApi.updateStatus(id, "resolved", comment);
  },
};

// Historical Events API
export const historicalEventsApi = {
  getAll: async (params?: {
    year?: number;
    category?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<HistoricalEvent>> => {
    const response = await api.get("/historical-events", { params });
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<HistoricalEvent>> => {
    const response = await api.get(`/historical-events/${id}`);
    return response.data;
  },

  create: async (
    eventData: Partial<HistoricalEvent>
  ): Promise<ApiResponse<HistoricalEvent>> => {
    const response = await api.post("/historical-events", eventData);
    return response.data;
  },

  update: async (
    id: string,
    eventData: Partial<HistoricalEvent>
  ): Promise<ApiResponse<HistoricalEvent>> => {
    const response = await api.put(`/historical-events/${id}`, eventData);
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/historical-events/${id}`);
    return response.data;
  },

  bulkUpload: async (file: File): Promise<ApiResponse<UploadResult>> => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post(
      "/historical-events/bulk-upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },
};

// Major Cases API
export const majorCasesApi = {
  getAll: async (params?: {
    status?: string;
    priority?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<MajorCase>> => {
    const response = await api.get("/major-cases", { params });
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<MajorCase>> => {
    const response = await api.get(`/major-cases/${id}`);
    return response.data;
  },

  create: async (
    caseData: Partial<MajorCase>
  ): Promise<ApiResponse<MajorCase>> => {
    const response = await api.post("/major-cases", caseData);
    return response.data;
  },

  update: async (
    id: string,
    caseData: Partial<MajorCase>
  ): Promise<ApiResponse<MajorCase>> => {
    const response = await api.put(`/major-cases/${id}`, caseData);
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/major-cases/${id}`);
    return response.data;
  },

  updateStatus: async (
    id: string,
    status: string
  ): Promise<ApiResponse<MajorCase>> => {
    const response = await api.put(`/major-cases/${id}/status`, { status });
    return response.data;
  },
};

// Polling API
export const pollingApi = {
  getAll: async (filters?: PollFilters): Promise<PaginatedResponse<Poll>> => {
    const response = await api.get("/polls", { params: filters });
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<Poll>> => {
    const response = await api.get(`/polls/${id}`);
    return response.data;
  },

  getStats: async (id: string): Promise<ApiResponse<any>> => {
    const response = await api.get(`/polls/${id}/stats`);
    return response.data;
  },

  create: async (pollData: CreatePollData): Promise<ApiResponse<Poll>> => {
    const response = await api.post("/polls", pollData);
    return response.data;
  },

  update: async (
    id: string,
    pollData: UpdatePollData
  ): Promise<ApiResponse<Poll>> => {
    const response = await api.put(`/polls/${id}`, pollData);
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/polls/${id}`);
    return response.data;
  },

  addOption: async (
    id: string,
    option: { option: string }
  ): Promise<ApiResponse<any>> => {
    const response = await api.post(`/polls/${id}/options`, option);
    return response.data;
  },

  vote: async (pollId: string, optionId: string): Promise<ApiResponse<any>> => {
    const response = await api.post(`/polls/${pollId}/vote/${optionId}`);
    return response.data;
  },

  getAnalytics: async (): Promise<ApiResponse<PollAnalytics>> => {
    const response = await api.get("/polls/analytics");
    return response.data;
  },

  getPoliticianComparison: async (
    politicianId: string
  ): Promise<ApiResponse<PollComparison[]>> => {
    const response = await api.get(
      `/polls/politician/${politicianId}/comparison`
    );
    return response.data;
  },

  getPartyComparison: async (
    partyId: string
  ): Promise<ApiResponse<PollComparison[]>> => {
    const response = await api.get(`/polls/party/${partyId}/comparison`);
    return response.data;
  },

  getCategories: async (): Promise<ApiResponse<string[]>> => {
    const response = await api.get("/polls/categories");
    return response.data;
  },
};

export default api;
