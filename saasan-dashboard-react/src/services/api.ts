import axios from "axios";
import type { User } from "../../../shared/types/user";
import type { Politician } from "../../../shared/types/politician";
import type { CorruptionReport } from "../../../shared/types/reports";
import type {
  HistoricalEvent,
  MajorCase,
  District,
  Municipality,
  Ward,
  DashboardStats,
  ServiceStatus,
  PollOption,
  PollVote,
} from "../../../shared/types";
import type {
  Poll,
  PollFilters,
  CreatePollData,
  UpdatePollData,
  PollAnalytics,
  PollComparison,
} from "../../../shared/types/polling";
import type { IPoliticianFilter } from "@/pages/PoliticiansPage";
import type {
  IGovernmentLevel,
  IParty,
  IPolitician,
  IPosition,
} from "@/types/politics";
import type {
  ApiResponse,
  PaginatedResponse,
  UploadResult,
} from "../../../shared/types/common";

// Utility function to transform snake_case to camelCase
const transformPolitician = (politician: IPolitician) => ({
  id: politician.id,
  fullName: politician.fullName,
  experienceYears: politician.experienceYears,
  party: politician.isIndependent ? "Independent" : politician.party,
  constituency: politician.constituencyNumber,
  rating: politician.rating || 0,
  createdAt: politician.createdAt,
  updatedAt: politician.updatedAt,
  isIndependent: politician.isIndependent,
  totalReports: politician.totalReports,
  verifiedReports: politician.verifiedReports,
  sourceCategories: politician.sourceCategories,
  // Add missing fields
  biography: politician.biography,
  education: politician.education,
  profession: politician.profession,
  contact: politician.contact,
  socialMedia: politician.socialMedia,
  age: politician.age,
  totalVotes: politician.totalVotes,
  isActive: politician.isActive,
  photoUrl: politician.photoUrl,
  dateOfBirth: politician.dateOfBirth,
  totalVotesReceived: politician.totalVotesReceived,
  termStartDate: politician.termStartDate,
  termEndDate: politician.termEndDate,
  profileImageUrl: politician.profileImageUrl,
  officialWebsite: politician.officialWebsite,
  partyId: politician.partyId,
  positionId: politician.positionId,
  constituencyId: politician.constituencyId,
  status: politician.status,
  experiences: politician.experiences,
  promises: politician.promises,
  achievements: politician.achievements,
});

// Utility function to transform camelCase to snake_case for API requests
const transformPoliticianForApi = (data: Partial<Politician> | any) => {
  const transformed: any = {
    full_name: data.fullName,
    position_id: data.positionId,
    party_id: data.partyId,
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
  };

  // Handle contact object
  if (data.contact) {
    transformed.contact_email = data.contact.email;
    transformed.contact_phone = data.contact.phone;
    transformed.official_website = data.contact.website;
  }

  // Handle social media object
  if (data.socialMedia) {
    transformed.social_media_links = {
      facebook: data.socialMedia.facebook,
      twitter: data.socialMedia.twitter,
      instagram: data.socialMedia.instagram,
    };
  }

  // Handle position and level arrays
  if (data.positionIds && Array.isArray(data.positionIds)) {
    transformed.position_ids = data.positionIds;
  }

  if (data.levelIds && Array.isArray(data.levelIds)) {
    transformed.level_ids = data.levelIds;
  }

  // Handle promises
  if (data.promises && Array.isArray(data.promises)) {
    transformed.promises = data.promises;
  }

  // Handle achievements
  if (data.achievements && Array.isArray(data.achievements)) {
    transformed.achievements = data.achievements;
  }

  return transformed;
};

// Utility function to transform report data from snake_case to camelCase
const transformReport = (data: Partial<CorruptionReport>) => ({
  id: data.id,
  referenceNumber: data.referenceNumber,
  title: data.title,
  description: data.description,
  categoryId: data.categoryId,
  reporterId: data.reporterId,
  isAnonymous: data.isAnonymous,
  locationDescription: data.locationDescription,
  latitude: data.latitude,
  longitude: data.longitude,
  district: data.district,
  municipality: data.municipality,
  ward: data.ward,
  status: data.status,
  priority: data.priority,
  assignedToOfficerId: data.assignedToOfficerId,
  dateOccurred: data.dateOccurred,
  amountInvolved: data.amountInvolved,
  peopleAffectedCount: data.peopleAffectedCount,
  publicVisibility: data.publicVisibility,
  upvotesCount: data.upvotesCount,
  downvotesCount: data.downvotesCount,
  viewsCount: data.viewsCount,
  sharesCount: data.sharesCount,
  resolvedAt: data.resolvedAt,
  createdAt: data.createdAt,
  updatedAt: data.updatedAt,
});

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("accessToken");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

// Auth API
export const authApi = {
  login: async (
    email: string,
    password: string,
  ): Promise<
    ApiResponse<{ accessToken: string; refreshToken: string; user: User }>
  > => {
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
  }): Promise<
    ApiResponse<{ accessToken: string; refreshToken: string; user: User }>
  > => {
    const response = await api.post("/auth/register", userData);
    return response.data;
  },

  getProfile: async (): Promise<ApiResponse<User>> => {
    const response = await api.get("/auth/profile");
    return response.data;
  },

  logout: () => {
    localStorage.removeItem("accessToken");
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

  getLiveServices: async (): Promise<ApiResponse<ServiceStatus[]>> => {
    const response = await api.get("/dashboard/live-services");
    return response.data;
  },
};

// Politicians API
export const politicsApi = {
  getAll: async (
    body?: IPoliticianFilter,
  ): Promise<PaginatedResponse<IPolitician>> => {
    const response = await api.post("/politician/filter", body || {});
    const transformedData = response.data.data?.map(transformPolitician) || [];
    return {
      ...response.data,
      data: transformedData,
    };
  },

  getById: async (id: string): Promise<ApiResponse<Politician>> => {
    const response = await api.get(`/politician/${id}`);
    return {
      ...response.data,
      data: transformPolitician(response.data.data),
    };
  },

  getByLevel: async (
    level: string,
    params?: Partial<Politician>,
  ): Promise<PaginatedResponse<Politician>> => {
    const response = await api.get(`/politicians/level/${level}`, { params });
    const transformedData = response.data.data?.map(transformPolitician) || [];
    return {
      ...response.data,
      data: transformedData,
    };
  },

  getGovernmentLevels: async (): Promise<IGovernmentLevel[]> => {
    const response = await api.get("/level");
    return response.data.data;
  },

  getPositions: async (): Promise<IPosition[]> => {
    const response = await api.get("/position");
    return response.data.data;
  },

  getParties: async (): Promise<IParty[]> => {
    const response = await api.get("/party");
    return response.data.data;
  },

  create: async (politicianData: any): Promise<ApiResponse<Politician>> => {
    const transformedData = transformPoliticianForApi(politicianData);
    const response = await api.post("/politician", transformedData);
    return {
      ...response.data,
      data: transformPolitician(response.data.data),
    };
  },

  update: async (
    id: string,
    politicianData: any,
  ): Promise<ApiResponse<Politician>> => {
    const transformedData = transformPoliticianForApi(politicianData);
    const response = await api.put(`/politician/${id}`, transformedData);
    return {
      ...response.data,
      data: transformPolitician(response.data.data),
    };
  },

  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/politician/${id}`);
    return response.data;
  },

  bulkUpload: async (file: File): Promise<ApiResponse<UploadResult>> => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post("/politicians/bulk-upload", formData);
    return response.data;
  },

  // Update individual sections
  updatePromises: async (
    id: string,
    promises: any[],
  ): Promise<ApiResponse<Politician>> => {
    const response = await api.put(`/politician/${id}/promises`, { promises });
    return {
      ...response.data,
      data: transformPolitician(response.data.data),
    };
  },

  updateAchievements: async (
    id: string,
    achievements: any[],
  ): Promise<ApiResponse<Politician>> => {
    const response = await api.put(`/politician/${id}/achievements`, {
      achievements,
    });
    return {
      ...response.data,
      data: transformPolitician(response.data.data),
    };
  },

  updateExperiences: async (
    id: string,
    experiences: any[],
  ): Promise<ApiResponse<Politician>> => {
    const response = await api.put(`/politician/${id}/experiences`, {
      experiences,
    });
    return {
      ...response.data,
      data: transformPolitician(response.data.data),
    };
  },
};

// Geographic API
export const geographicApi = {
  // Provinces
  getProvinces: async (): Promise<ApiResponse<any[]>> => {
    const response = await api.get("/locations/provinces");
    return response.data;
  },

  createProvince: async (provinceData: any): Promise<ApiResponse<any>> => {
    const response = await api.post("/locations/provinces", provinceData);
    return response.data;
  },

  // Districts
  getDistricts: async (
    provinceId?: string,
  ): Promise<ApiResponse<District[]>> => {
    const url = provinceId
      ? `/locations/provinces/${provinceId}/districts`
      : "/locations/districts";
    const response = await api.get(url);
    return response.data;
  },

  createDistrict: async (
    districtData: Partial<District>,
  ): Promise<ApiResponse<District>> => {
    const response = await api.post("/locations/districts", districtData);
    return response.data;
  },

  // Municipalities
  getMunicipalities: async (
    districtId: string,
  ): Promise<ApiResponse<Municipality[]>> => {
    const response = await api.get(
      `/locations/districts/${districtId}/municipalities`,
    );
    return response.data;
  },

  createMunicipality: async (
    municipalityData: Partial<Municipality>,
  ): Promise<ApiResponse<Municipality>> => {
    const response = await api.post(
      "/locations/municipalities",
      municipalityData,
    );
    return response.data;
  },

  // Wards
  getWards: async (
    districtId: string,
    municipalityId: string,
  ): Promise<ApiResponse<Ward[]>> => {
    const response = await api.get(
      `/locations/districts/${districtId}/municipalities/${municipalityId}/wards`,
    );
    return response.data;
  },

  createWard: async (wardData: Partial<Ward>): Promise<ApiResponse<Ward>> => {
    const response = await api.post("/locations/wards", wardData);
    return response.data;
  },

  // Constituencies
  getConstituencies: async (
    districtId?: string,
  ): Promise<ApiResponse<any[]>> => {
    const url = districtId
      ? `/locations/districts/${districtId}/constituencies`
      : "/locations/constituencies";
    const response = await api.get(url);
    return response.data;
  },

  createConstituency: async (
    constituencyData: any,
  ): Promise<ApiResponse<any>> => {
    const response = await api.post(
      "/locations/constituencies",
      constituencyData,
    );
    return response.data;
  },

  // Bulk uploads
  bulkUploadDistricts: async (
    file: File,
  ): Promise<ApiResponse<UploadResult>> => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post(
      "/locations/districts/bulk-upload",
      formData,
    );
    return response.data;
  },

  bulkUploadMunicipalities: async (
    file: File,
  ): Promise<ApiResponse<UploadResult>> => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post(
      "/locations/municipalities/bulk-upload",
      formData,
    );
    return response.data;
  },

  bulkUploadWards: async (file: File): Promise<ApiResponse<UploadResult>> => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post("/locations/wards/bulk-upload", formData);
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
    const response = await api.get("/report", { params });
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
    comment?: string,
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
    comment?: string,
  ): Promise<ApiResponse<CorruptionReport>> => {
    return reportsApi.updateStatus(id, "verified", comment);
  },

  reject: async (
    id: string,
    comment?: string,
  ): Promise<ApiResponse<CorruptionReport>> => {
    return reportsApi.updateStatus(id, "dismissed", comment);
  },

  resolve: async (
    id: string,
    comment?: string,
  ): Promise<ApiResponse<CorruptionReport>> => {
    return reportsApi.updateStatus(id, "resolved", comment);
  },

  delete: async (id: string) => {
    const response = await api.put(`/report/${id}`);
    return response;
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
    const response = await api.get("/event", { params });
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<HistoricalEvent>> => {
    const response = await api.get(`/event/${id}`);
    return response.data;
  },

  create: async (
    eventData: Partial<HistoricalEvent>,
  ): Promise<ApiResponse<HistoricalEvent>> => {
    const response = await api.post("/event", eventData);
    return response.data;
  },

  update: async (
    id: string,
    eventData: Partial<HistoricalEvent>,
  ): Promise<ApiResponse<HistoricalEvent>> => {
    const response = await api.put(`/event/${id}`, eventData);
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/event/${id}`);
    return response.data;
  },

  bulkUpload: async (file: File): Promise<ApiResponse<UploadResult>> => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post("/event/bulk-upload", formData);
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
    caseData: Partial<MajorCase>,
  ): Promise<ApiResponse<MajorCase>> => {
    const response = await api.post("/major-cases", caseData);
    return response.data;
  },

  update: async (
    id: string,
    caseData: Partial<MajorCase>,
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
    status: string,
  ): Promise<ApiResponse<MajorCase>> => {
    const response = await api.put(`/major-cases/${id}/status`, { status });
    return response.data;
  },
};

// Polling API
export const pollingApi = {
  getAll: async (filters?: PollFilters): Promise<PaginatedResponse<Poll>> => {
    const response = await api.get("/poll", { params: filters });
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<Poll>> => {
    const response = await api.get(`/poll/${id}`);
    return response.data;
  },

  getStats: async (id: string): Promise<ApiResponse<PollAnalytics>> => {
    const response = await api.get(`/poll/${id}/stats`);
    return response.data;
  },

  create: async (pollData: CreatePollData): Promise<ApiResponse<Poll>> => {
    const response = await api.post("/poll", pollData);
    return response.data;
  },

  update: async (
    id: string,
    pollData: UpdatePollData,
  ): Promise<ApiResponse<Poll>> => {
    const response = await api.put(`/poll/${id}`, pollData);
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/poll/${id}`);
    return response.data;
  },

  addOption: async (
    id: string,
    option: { option: string },
  ): Promise<ApiResponse<PollOption>> => {
    const response = await api.post(`/poll/${id}/options`, option);
    return response.data;
  },

  vote: async (
    pollId: string,
    optionId: string,
  ): Promise<ApiResponse<PollVote>> => {
    const response = await api.post(`/poll/${pollId}/vote/${optionId}`);
    return response.data;
  },

  getAnalytics: async (): Promise<ApiResponse<PollAnalytics>> => {
    const response = await api.get("/poll/analytics");
    return response.data;
  },

  getPoliticianComparison: async (
    politicianId: string,
  ): Promise<ApiResponse<PollComparison[]>> => {
    const response = await api.get(
      `/poll/politician/${politicianId}/comparison`,
    );
    return response.data;
  },

  getPartyComparison: async (
    partyId: string,
  ): Promise<ApiResponse<PollComparison[]>> => {
    const response = await api.get(`/poll/party/${partyId}/comparison`);
    return response.data;
  },

  getCategories: async () => {
    const response = await api.get("/poll/categories");
    return response.data;
  },

  getStatuses: async () => {
    const response = await api.get("/poll/statuses");
    return response.data;
  },

  getTypes: async () => {
    const response = await api.get("/poll/types");
    return response.data;
  },

  createCategory: async (data: { name: string; name_nepali?: string }) => {
    const response = await api.post("/poll/categories", data);
    return response.data;
  },

  createType: async (data: { name: string; name_nepali?: string }) => {
    const response = await api.post("/poll/types", data);
    return response.data;
  },
};

export default api;
