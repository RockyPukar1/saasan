import axios from "axios";
import type { User } from "../../../shared/types/user";
import type { Politician } from "../../../shared/types/politician";
import type { CorruptionReport } from "../../../shared/types/reports";
import type {
  HistoricalEvent,
  MajorCase,
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
import type { IPoliticianFilter } from "@/screens/PoliticiansPage";
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
import type {
  IReport,
  IReportPriority,
  IReportType,
  IReportVisibility,
  IReportStatus,
} from "@/types/reports";
import type {
  IProvince,
  IDistrict,
  IMunicipality,
  IWard,
  IConstituency,
} from "@/types/location";

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
const transformReport = (data: any) => ({
  id: data._id || data.id,
  referenceNumber: data.referenceNumber,
  title: data.title,
  description: data.description,
  typeId: data.typeId,
  reporterId: data.reporterId,
  isAnonymous: data.isAnonymous,
  verificationNotes: data.verificationNotes,
  verifiedById: data.verifiedById,
  verifiedAt: data.verifiedAt,
  provinceId: data.provinceId,
  districtId: data.districtId,
  constituencyId: data.constituencyId,
  municipalityId: data.municipalityId,
  wardId: data.wardId,
  status: data.status,
  priority: data.priority,
  isResolved: data.isResolved,
  assignedToOfficerId: data.assignedToOfficerId,
  dateOccurred: data.dateOccurred,
  amountInvolved: data.amountInvolved,
  peopleAffectedCount: data.peopleAffectedCount,
  publicVisibility: data.publicVisibility,
  tags: data.tags,
  upvotesCount: data.upvotesCount,
  downvotesCount: data.downvotesCount,
  viewsCount: data.viewsCount,
  resolvedAt: data.resolvedAt,
  createdAt: data.createdAt,
  updatedAt: data.updatedAt,
  statusUpdates: data.statusUpdates,
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
  getProvinces: async (
    page?: number,
    limit?: number,
  ): Promise<PaginatedResponse<IProvince>> => {
    const url =
      page && limit ? `/province?page=${page}&limit=${limit}` : `/province`;
    const response = await api.get(url);
    return response.data.data;
  },

  getProvince: async (provinceId: string): Promise<{ data: IProvince }> => {
    const response = await api.get(`/province/${provinceId}`);
    return response.data;
  },

  getProvinceById: async (provinceId: string): Promise<{ data: IProvince }> => {
    const response = await api.get(`/province/${provinceId}`);
    return response.data.data;
  },

  createProvince: async (provinceData: any): Promise<{ data: IProvince }> => {
    const response = await api.post("/province", provinceData);
    return response.data;
  },

  // Districts
  getDistricts: async (
    page?: number,
    limit?: number,
  ): Promise<PaginatedResponse<IDistrict>> => {
    const url =
      page && limit ? `/district?page=${page}&limit=${limit}` : `/district`;
    const response = await api.get(url);
    return response.data.data;
  },

  getDistrictsByProvinceId: async (
    provinceId: string,
    page?: number,
    limit?: number,
  ): Promise<PaginatedResponse<IDistrict>> => {
    const url =
      page && limit
        ? `/district/province/${provinceId}?page=${page}&limit=${limit}`
        : `/district/province/${provinceId}`;
    const response = await api.get(url);
    return response.data.data;
  },

  getDistrictById: async (districtId: string): Promise<{ data: IDistrict }> => {
    const response = await api.get(`/district/${districtId}`);
    return response.data;
  },

  createDistrict: async (districtData: any): Promise<{ data: IDistrict }> => {
    const response = await api.post("/district", districtData);
    return response.data;
  },

  // Municipalities
  getMunicipalities: async (
    page?: number,
    limit?: number,
  ): Promise<PaginatedResponse<IMunicipality>> => {
    const url =
      page && limit
        ? `/municipality?page=${page}&limit=${limit}`
        : `/municipality`;
    const response = await api.get(url);
    return response.data.data;
  },

  getMunicipalitiesByProvinceId: async (
    provinceId: string,
    page?: number,
    limit?: number,
  ): Promise<PaginatedResponse<IMunicipality>> => {
    const url =
      page && limit
        ? `/municipality/province/${provinceId}?page=${page}&limit=${limit}`
        : `/municipality/province/${provinceId}`;
    const response = await api.get(url);
    return response.data.data;
  },

  getMunicipalitiesByDistrictId: async (
    districtId: string,
    page?: number,
    limit?: number,
  ): Promise<PaginatedResponse<IMunicipality>> => {
    const url =
      page && limit
        ? `/municipality/district/${districtId}?page=${page}&limit=${limit}`
        : `/municipality/district/${districtId}`;
    const response = await api.get(url);
    return response.data.data;
  },

  // Wards
  getWards: async (
    page?: number,
    limit?: number,
  ): Promise<PaginatedResponse<IWard>> => {
    const url = page && limit ? `/ward?page=${page}&limit=${limit}` : `/ward`;
    const response = await api.get(url);
    return response.data.data;
  },

  getWardsByProvinceId: async (
    provinceId: string,
    page?: number,
    limit?: number,
  ): Promise<PaginatedResponse<IWard>> => {
    const url =
      page && limit
        ? `/ward/province/${provinceId}?page=${page}&limit=${limit}`
        : `/ward/province/${provinceId}`;
    const response = await api.get(url);
    return response.data.data;
  },

  getWardsByDistrictId: async (
    districtId: string,
    page?: number,
    limit?: number,
  ): Promise<PaginatedResponse<IWard>> => {
    const url =
      page && limit
        ? `/ward/district/${districtId}?page=${page}&limit=${limit}`
        : `/ward/district/${districtId}`;
    const response = await api.get(url);
    return response.data.data;
  },

  getWardsByMunicipalityId: async (
    municipalityId: string,
    page?: number,
    limit?: number,
  ): Promise<PaginatedResponse<IWard>> => {
    const url =
      page && limit
        ? `/ward/municipality/${municipalityId}?page=${page}&limit=${limit}`
        : `/ward/municipality/${municipalityId}`;
    const response = await api.get(url);
    return response.data.data;
  },

  getWardById: async (wardId: string): Promise<{ data: IWard }> => {
    const response = await api.get(`/ward/${wardId}`);
    return response.data;
  },

  createWard: async (wardData: any): Promise<{ data: IWard }> => {
    const response = await api.post("/ward", wardData);
    return response.data;
  },

  // Constituencies
  getConstituencies: async (
    page?: number,
    limit?: number,
  ): Promise<PaginatedResponse<IConstituency>> => {
    const url =
      page && limit
        ? `/constituency?page=${page}&limit=${limit}`
        : `/constituency`;
    const response = await api.get(url);
    return response.data.data;
  },

  getConstituenciesByProvinceId: async (
    provinceId: string,
    page?: number,
    limit?: number,
  ): Promise<PaginatedResponse<IConstituency>> => {
    const url =
      page && limit
        ? `/constituency/province/${provinceId}?page=${page}&limit=${limit}`
        : `/constituency/province/${provinceId}`;
    const response = await api.get(url);
    return response.data.data;
  },

  getConstituenciesByDistrictId: async (
    districtId: string,
    page?: number,
    limit?: number,
  ): Promise<PaginatedResponse<IConstituency>> => {
    const url =
      page && limit
        ? `/constituency/district/${districtId}?page=${page}&limit=${limit}`
        : `/constituency/district/${districtId}`;
    const response = await api.get(url);
    return response.data.data;
  },

  getConstituencyById: async (
    constituencyId: string,
  ): Promise<{ data: IConstituency }> => {
    const response = await api.get(`/constituency/${constituencyId}`);
    return response.data;
  },

  getConstituenciesByDistrict: async (
    districtId: string,
    page?: number,
    limit?: number,
  ): Promise<PaginatedResponse<IConstituency>> => {
    const url =
      page && limit
        ? `/district/${districtId}/constituency?page=${page}&limit=${limit}`
        : `/district/${districtId}/constituency`;
    const response = await api.get(url);
    return response.data.data;
  },

  createConstituency: async (
    constituencyData: any,
  ): Promise<{ data: IConstituency }> => {
    const response = await api.post("/constituency", constituencyData);
    return response.data;
  },
};

// Reports API
export const reportsApi = {
  getAll: async (params?: {
    status?: string[];
    priority?: string[];
    visibility?: string[];
    type?: string[];
  }): Promise<IReport[]> => {
    const response = await api.post("/report/filter", params || {});
    return response.data.data;
  },

  // Admin update report endpoint
  adminUpdateReport: async (
    id: string,
    data: {
      priorityId?: string;
      typeId?: string;
      statusId?: string;
      visibilityId?: string;
      comment: string;
    },
  ) => {
    const response = await api.put(`/admin/report/${id}`, data);
    return response.data;
  },

  getById: async (id: string): Promise<IReport> => {
    const response = await api.get(`/report/${id}`);
    return response.data.data;
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

  getActivities: async (
    id: string,
    page?: number,
    limit?: number,
  ): Promise<PaginatedResponse<any>> => {
    const response = await api.get(`/report/${id}/activities`, {
      params: { page, limit },
    });
    return response.data;
  },

  getRecentActivities: async (limit?: number): Promise<any[]> => {
    const response = await api.get(`/report/activities/recent`, {
      params: { limit },
    });
    return response.data;
  },

  updatePriority: async (
    id: string,
    priority: string,
    comment?: string,
  ): Promise<ApiResponse<CorruptionReport>> => {
    const response = await api.put(`/reports/${id}/priority`, {
      priority,
      comment,
    });
    return {
      ...response.data,
      data: transformReport(response.data.data),
    };
  },

  updateVisibility: async (
    id: string,
    publicVisibility: string,
    comment?: string,
  ): Promise<ApiResponse<CorruptionReport>> => {
    const response = await api.put(`/reports/${id}/visibility`, {
      publicVisibility,
      comment,
    });
    return {
      ...response.data,
      data: transformReport(response.data.data),
    };
  },

  updateReportType: async (
    id: string,
    reportType: string,
    comment?: string,
  ): Promise<ApiResponse<CorruptionReport>> => {
    const response = await api.put(`/reports/${id}/type`, {
      reportType,
      comment,
    });
    return {
      ...response.data,
      data: transformReport(response.data.data),
    };
  },
};

// Report Types API
export const reportTypesApi = {
  getAll: async (): Promise<IReportType[]> => {
    const response = await api.get("/admin/report/types");
    return response.data.data;
  },

  create: async (data: {
    type: string;
    description: string;
  }): Promise<ApiResponse<any>> => {
    const response = await api.post("/admin/report/types", data);
    return response.data;
  },

  update: async (
    id: string,
    data: { type: string; description: string },
  ): Promise<ApiResponse<any>> => {
    const response = await api.put(`/admin/report/types/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/admin/report/types/${id}`);
    return response.data;
  },
};

// Report Statuses API
export const reportStatusesApi = {
  getAll: async (): Promise<IReportStatus[]> => {
    const response = await api.get("/admin/report/statuses");
    return response.data.data;
  },

  create: async (data: {
    status: string;
    description: string;
  }): Promise<ApiResponse<any>> => {
    const response = await api.post("/admin/report/statuses", data);
    return response.data;
  },

  update: async (
    id: string,
    data: { status: string; description: string },
  ): Promise<ApiResponse<any>> => {
    const response = await api.put(`/admin/report/statuses/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/admin/report/statuses/${id}`);
    return response.data;
  },
};

// Report Priorities API
export const reportPrioritiesApi = {
  getAll: async (): Promise<IReportPriority[]> => {
    const response = await api.get("/admin/report/priorities");
    return response.data.data;
  },

  create: async (data: {
    priority: string;
    description: string;
  }): Promise<ApiResponse<any>> => {
    const response = await api.post("/admin/report/priorities", data);
    return response.data;
  },

  update: async (
    id: string,
    data: { priority: string; description: string },
  ): Promise<ApiResponse<any>> => {
    const response = await api.put(`/admin/report/priorities/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/admin/report/priorities/${id}`);
    return response.data;
  },
};

// Report Visibilities API
export const reportVisibilitiesApi = {
  getAll: async (): Promise<IReportVisibility[]> => {
    const response = await api.get("/admin/report/visibilities");
    return response.data.data;
  },

  create: async (data: {
    visibility: string;
    description: string;
  }): Promise<ApiResponse<any>> => {
    const response = await api.post("/admin/report/visibilities", data);
    return response.data;
  },

  update: async (
    id: string,
    data: { visibility: string; description: string },
  ): Promise<ApiResponse<any>> => {
    const response = await api.put(`/admin/report/visibilities/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/admin/report/visibilities/${id}`);
    return response.data;
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
