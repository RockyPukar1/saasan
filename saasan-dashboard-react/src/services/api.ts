import axios from "axios";
import type {
  IReport,
  IReportPriority,
  IReportType,
  IReportVisibility,
  IReportStatus,
} from "@/types/report";
import type {
  IProvince,
  IDistrict,
  IMunicipality,
  IWard,
  IConstituency,
} from "@/types/location";
import type {
  IGovernmentLevel,
  IParty,
  IPolitician,
  IPosition,
} from "@/types/politics";
import type {
  ApiResponse,
  IDashboardStats,
  IServiceStatus,
  PaginatedResponse,
} from "@/types";
import type {
  ICreatePollData,
  IPoll,
  IPollAnalytics,
  IPollComparison,
  IPollFilters,
  IPollOption,
  IPollVote,
  IUpdatePollData,
} from "@/types/poll";
import type { IUser } from "@/types/user";
import type { IPoliticianFilter } from "@/screens/PoliticiansScreen";
import type { IMajorCase } from "@/types/case";
import type { IHistoricalEvent } from "@/types/event";
import type { AuthPayload, ProfilePayload } from "@/types/auth";
import type { IAuthSession } from "@/types/session";
import type {
  IRolePermission,
  IUpdateRolePermissionPayload,
} from "@/types/role-permission";
import type { IJobRecord } from "@/types/job";
import type { IBudget } from "@/types/budget";

export interface IMessageThread {
  id: string;
  subject: string;
  content: string;
  category: string;
  urgency: string;
  status: string;
  participants: {
    citizen: {
      id: string;
      name: string;
      email: string;
    };
    politician: {
      id: string;
      name: string;
    };
    politicians?: Array<{
      id: string;
      name: string;
    }>;
  };
  messages: Array<{
    id?: string;
    _id?: string;
    senderId: string;
    senderType: string;
    content: string;
    createdAt: string;
  }>;
  sourceReportId?: string;
  messageOrigin?: string;
  createdAt: string;
  updatedAt: string;
}

type ApprovalSuggestionsResponse = {
  reportId: string;
  hasJurisdictionPolitician: boolean;
  suggestedPoliticians: IPolitician[];
};

type ApiPaginationMeta = {
  total: number;
  limit: number;
  nextCursor?: string | null;
  hasNext?: boolean;
};

const DEFAULT_LIST_LIMIT = 50;

declare module "axios" {
  export interface InternalAxiosRequestConfig {
    _retry?: boolean;
  }
}

// Build the backend DTO payload from the admin form state.
const buildPoliticianPayload = (data: Partial<IPolitician> | any) => {
  const transformed: any = {
    fullName: data.fullName,
    partyId: data.partyId,
    biography: data.biography,
    education: data.education,
    experienceYears: data.experienceYears,
    status: data.status,
    profession: data.profession,
    age: data.age,
    totalVotes: data.totalVotes,
    isActive: data.isActive,
    photoUrl: data.photoUrl,
    joinedDate: data.joinedDate,
    constituencyId: data.constituencyId,
    isIndependent: data.isIndependent,
  };

  // Handle contact object
  if (data.contact) {
    transformed.contact = {
      email: data.contact.email,
      phone: data.contact.phone,
      website: data.contact.website,
    };
  }

  // Handle social media object
  if (data.socialMedia) {
    transformed.socialMedia = {
      facebook: data.socialMedia.facebook,
      twitter: data.socialMedia.twitter,
      instagram: data.socialMedia.instagram,
    };
  }

  // Handle position and level arrays
  if (data.positionIds && Array.isArray(data.positionIds)) {
    transformed.positionIds = data.positionIds;
  }

  if (data.levelIds && Array.isArray(data.levelIds)) {
    transformed.levelIds = data.levelIds;
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
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

const getAccessToken = () => localStorage.getItem("accessToken");
const getRefreshToken = () => localStorage.getItem("refreshToken");
const getCurrentSessionId = () => localStorage.getItem("sessionId");

const setTokens = (
  accessToken: string,
  refreshToken: string,
  sessionId?: string,
) => {
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
  if (sessionId) {
    localStorage.setItem("sessionId", sessionId);
  }
};

const clearTokens = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("sessionId");
};

const unsupportedRoute = <T>(feature: string): Promise<T> => {
  return Promise.reject(
    new Error(`${feature} is not implemented in the backend yet.`),
  );
};

const unwrapResponseData = <T>(response: {
  data: T | ApiResponse<T>;
}): T => {
  const payload = response.data as T | ApiResponse<T>;

  if (
    payload &&
    typeof payload === "object" &&
    "success" in payload &&
    "data" in payload
  ) {
    return (payload as ApiResponse<T>).data;
  }

  return payload as T;
};

const unwrapPaginatedResponse = <T>(response: {
  data: unknown;
}): PaginatedResponse<T> => {
  const payload = response.data as
    | (ApiResponse<T[]> & { meta?: { pagination?: ApiPaginationMeta } })
    | PaginatedResponse<T>
    | T[];

  if (
    payload &&
    typeof payload === "object" &&
    "success" in payload &&
    Array.isArray(payload.data)
  ) {
    const pagination = payload.meta?.pagination;
    return toPagination({
      data: payload.data,
      total: pagination?.total ?? payload.data.length,
      limit: pagination?.limit ?? Math.max(payload.data.length, 1),
      nextCursor: pagination?.nextCursor ?? null,
      hasNext: pagination?.hasNext ?? false,
    });
  }

  if (
    payload &&
    typeof payload === "object" &&
    "data" in payload &&
    Array.isArray((payload as PaginatedResponse<T>).data)
  ) {
    return toPagination(payload as PaginatedResponse<T>);
  }

  if (Array.isArray(payload)) {
    return toPagination({
      data: payload,
      total: payload.length,
      limit: Math.max(payload.length, 1),
      nextCursor: null,
      hasNext: false,
    });
  }

  return toPagination({
    data: [],
    total: 0,
    limit: 1,
    nextCursor: null,
    hasNext: false,
  });
};

const toApiResponse = <T>(rawPayload: any, data: T): ApiResponse<T> => {
  if (
    rawPayload &&
    typeof rawPayload === "object" &&
    "success" in rawPayload &&
    "data" in rawPayload
  ) {
    return {
      ...(rawPayload as ApiResponse<T>),
      data,
    };
  }

  return {
    success: true,
    data,
    message: "Success",
  };
};

const toPagination = <T>(
  payload: PaginatedResponse<T>,
): PaginatedResponse<T> => payload;

const fetchAllCursorPages = async <T>(
  fetchPage: (cursor?: string | null) => Promise<PaginatedResponse<T>>,
): Promise<T[]> => {
  const allItems: T[] = [];
  let cursor: string | null | undefined = null;
  let hasNext = true;

  while (hasNext) {
    const page = await fetchPage(cursor);
    allItems.push(...page.data);
    cursor = page.nextCursor;
    hasNext = page.hasNext && Boolean(page.nextCursor);
  }

  return allItems;
};

const toPollPayload = (
  data: ICreatePollData | IUpdatePollData,
  options?: {
    includeStartDate?: boolean;
  },
): Record<string, unknown> => {
  const payload: Record<string, unknown> = {};

  if ("title" in data && data.title !== undefined) payload.title = data.title;
  if ("description" in data && data.description !== undefined) {
    payload.description = data.description;
  }
  if ("type" in data && data.type !== undefined) payload.type = data.type;
  if ("category" in data && data.category !== undefined) {
    payload.category = data.category;
  }
  if ("status" in data && data.status !== undefined) {
    payload.status = String(data.status).toLowerCase();
  }
  if ("options" in data && data.options !== undefined) {
    payload.options = data.options;
  }

  if ("end_date" in data && data.end_date !== undefined) {
    payload.endDate = data.end_date
      ? new Date(data.end_date).toISOString()
      : undefined;
  }

  if ("requires_verification" in data) {
    payload.requiresVerification = Boolean(data.requires_verification);
  }

  if (options?.includeStartDate && !("startDate" in payload)) {
    payload.startDate = new Date().toISOString();
  }

  return payload;
};

const toMajorCasePayload = (caseData: Partial<IMajorCase>) => {
  const payload: Record<string, unknown> = {};

  if ("title" in caseData && caseData.title !== undefined) {
    payload.title = caseData.title;
  }
  if ("description" in caseData && caseData.description !== undefined) {
    payload.description = caseData.description;
  }
  if ("status" in caseData && caseData.status !== undefined) {
    payload.status = caseData.status;
  }
  if ("priority" in caseData && caseData.priority !== undefined) {
    payload.priority = caseData.priority;
  }
  if ("amountInvolved" in caseData && caseData.amountInvolved !== undefined) {
    payload.amountInvolved = String(caseData.amountInvolved);
  }
  if ("dateOccurred" in caseData && caseData.dateOccurred !== undefined) {
    payload.dateOccurred = caseData.dateOccurred;
  }
  if (
    "peopleAffectedCount" in caseData &&
    caseData.peopleAffectedCount !== undefined
  ) {
    payload.peopleAffectedCount = caseData.peopleAffectedCount;
  }
  if (
    "locationDescription" in caseData &&
    caseData.locationDescription !== undefined
  ) {
    payload.locationDescription = caseData.locationDescription;
  }
  if ("provinceId" in caseData && caseData.provinceId !== undefined) {
    payload.provinceId = caseData.provinceId || undefined;
  }
  if ("districtId" in caseData && caseData.districtId !== undefined) {
    payload.districtId = caseData.districtId || undefined;
  }
  if ("constituencyId" in caseData && caseData.constituencyId !== undefined) {
    payload.constituencyId = caseData.constituencyId || undefined;
  }
  if ("municipalityId" in caseData && caseData.municipalityId !== undefined) {
    payload.municipalityId = caseData.municipalityId || undefined;
  }
  if ("wardId" in caseData && caseData.wardId !== undefined) {
    payload.wardId = caseData.wardId || undefined;
  }
  if ("isPublic" in caseData && caseData.isPublic !== undefined) {
    payload.isPublic = caseData.isPublic;
  }

  return payload;
};

const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    clearTokens();
    return null;
  }

  try {
    const response = await api.post("/auth/refresh-token", { refreshToken });

    if (response.data?.success) {
      const newAccessToken = response.data.data.accessToken;
      const newRefreshToken = response.data.data.refreshToken;
      const newSessionId = response.data.data.sessionId;

      setTokens(newAccessToken, newRefreshToken, newSessionId);
      return newAccessToken;
    }

    clearTokens();
    return null;
  } catch (error) {
    clearTokens();
    return null;
  }
};

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
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
  async (error) => {
    const originalRequest = error.config;

    if (!error.response) {
      return Promise.reject(error);
    }

    if (
      error.response.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/login") &&
      !originalRequest.url?.includes("/admin/auth/login") &&
      !originalRequest.url?.includes("/auth/refresh-token")
    ) {
      originalRequest._retry = true;

      try {
        if (!isRefreshing) {
          isRefreshing = true;
          refreshPromise = refreshAccessToken();
        }

        const newAccessToken = await refreshPromise;

        isRefreshing = false;
        refreshPromise = null;

        if (!newAccessToken) {
          clearTokens();
          window.location.href = "/login";
          return Promise.reject(error);
        }

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        refreshPromise = null;
        clearTokens();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

// Auth API
export const authApi = {
  login: async (
    email: string,
    password: string,
  ): Promise<ApiResponse<AuthPayload>> => {
    const response = await api.post("/admin/auth/login", {
      email: email.trim().toLowerCase(),
      password,
    });
    return response.data;
  },

  refreshToken: async (
    refreshToken: string,
  ): Promise<ApiResponse<AuthPayload>> => {
    const response = await api.post("/auth/refresh-token", { refreshToken });
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
  }): Promise<ApiResponse<AuthPayload>> => {
    const response = await api.post("/auth/register", userData);
    return response.data;
  },

  getProfile: async (): Promise<ApiResponse<ProfilePayload>> => {
    const response = await api.get("/admin/user/profile");
    return response.data;
  },

  logout: async () => {
    try {
      await sessionApi.logoutCurrentSession();
    } catch (error) {
      // Ignore logout API failure
    } finally {
      clearTokens();
    }
  },
};

export const rolePermissionApi = {
  getAll: async (): Promise<ApiResponse<IRolePermission[]>> => {
    const response = await api.get("/role-permissions");
    return response.data;
  },

  getByRole: async (role: string): Promise<ApiResponse<IRolePermission>> => {
    const response = await api.get(`/role-permissions/${role}`);
    return response.data;
  },

  update: async (
    role: string,
    payload: IUpdateRolePermissionPayload,
  ): Promise<ApiResponse<IRolePermission>> => {
    const response = await api.put(`/role-permissions/${role}`, payload);
    return response.data;
  },
};

export const sessionApi = {
  getMySessions: async (): Promise<ApiResponse<IAuthSession[]>> => {
    const response = await api.get("/auth/sessions");
    return response.data;
  },

  revokeSession: async (sessionId: string): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/auth/sessions/${sessionId}`);
    return response.data;
  },

  revokeAllOtherSessions: async (): Promise<ApiResponse<null>> => {
    const response = await api.post("/auth/sessions/revoke-all");
    return response.data;
  },

  logoutCurrentSession: async (): Promise<ApiResponse<null>> => {
    const response = await api.post("/auth/logout");
    return response.data;
  },

  getCurrentSessionId,
};

export const jobsApi = {
  getFailed: async (): Promise<ApiResponse<IJobRecord[]>> => {
    const response = await api.get("/admin/jobs/failed");
    return toApiResponse(response.data, unwrapResponseData<IJobRecord[]>(response));
  },

  retry: async (jobId: string): Promise<ApiResponse<{ jobId: string }>> => {
    const response = await api.post(`/admin/jobs/${jobId}/retry`);
    return response.data;
  },
};

export const budgetApi = {
  getAll: async (): Promise<ApiResponse<IBudget[]>> => {
    const data = await fetchAllCursorPages<IBudget>(async (cursor) => {
      const response = await api.get("/budget", {
        params: {
          ...(cursor ? { cursor } : {}),
          limit: 100,
        },
      });
      return unwrapPaginatedResponse<IBudget>(response);
    });
    return toApiResponse(undefined, data);
  },
};

export const messageThreadApi = {
  getByReportId: async (reportId: string): Promise<ApiResponse<IMessageThread>> => {
    const response = await api.get(`/message/report/${reportId}`);
    return toApiResponse(response.data, unwrapResponseData<IMessageThread>(response));
  },

  addReply: async (
    messageId: string,
    content: string,
  ): Promise<ApiResponse<IMessageThread>> => {
    const response = await api.post(`/message/${messageId}/reply`, { content });
    return toApiResponse(response.data, unwrapResponseData<IMessageThread>(response));
  },
};

// Dashboard API
export const dashboardApi = {
  getStats: async (): Promise<ApiResponse<IDashboardStats>> => {
    const response = await api.get("/admin/dashboard/stats");
    return response.data;
  },

  getMajorCases: async (): Promise<ApiResponse<IMajorCase[]>> => {
    const response = await majorCasesApi.getAll({ limit: 5 });
    return {
      success: true,
      data: response.data,
      message: "Major cases fetched successfully",
    };
  },

  getLiveServices: async (): Promise<ApiResponse<IServiceStatus[]>> => {
    return unsupportedRoute("Live service status");
  },
};

// Politicians API
export const politicsApi = {
  getAll: async (
    body?: IPoliticianFilter,
    pagination?: {
      cursor?: string | null;
      limit?: number;
    },
  ): Promise<PaginatedResponse<IPolitician>> => {
    const response = await api.post("/politician/filter", {
      ...(pagination?.cursor ? { cursor: pagination.cursor } : {}),
      limit: pagination?.limit || DEFAULT_LIST_LIMIT,
      ...(body || {}),
    });
    return unwrapPaginatedResponse<IPolitician>(response);
  },

  getById: async (id: string): Promise<ApiResponse<IPolitician>> => {
    const response = await api.get(`/politician/${id}`);
    return toApiResponse(response.data, unwrapResponseData<IPolitician>(response));
  },

  getByLevel: async (
    level: string,
    params?: {
      cursor?: string | null;
      limit?: number;
    },
  ): Promise<PaginatedResponse<IPolitician>> => {
    const response = await api.get(`/politician/level/${level}`, {
      params: {
        ...(params?.cursor ? { cursor: params.cursor } : {}),
        limit: params?.limit || DEFAULT_LIST_LIMIT,
        ...(params || {}),
      },
    });
    return unwrapPaginatedResponse<IPolitician>(response);
  },

  getAllList: async (body?: IPoliticianFilter): Promise<IPolitician[]> => {
    return fetchAllCursorPages<IPolitician>((cursor) =>
      politicsApi.getAll(body, { cursor, limit: 100 }),
    );
  },

  getGovernmentLevels: async (): Promise<IGovernmentLevel[]> => {
    return fetchAllCursorPages<IGovernmentLevel>(async (cursor) => {
      const response = await api.get("/level", {
        params: {
          ...(cursor ? { cursor } : {}),
          limit: 100,
        },
      });
      return unwrapPaginatedResponse<IGovernmentLevel>(response);
    });
  },

  getPositions: async (): Promise<IPosition[]> => {
    return fetchAllCursorPages<IPosition>(async (cursor) => {
      const response = await api.get("/position", {
        params: {
          ...(cursor ? { cursor } : {}),
          limit: 100,
        },
      });
      return unwrapPaginatedResponse<IPosition>(response);
    });
  },

  getParties: async (): Promise<IParty[]> => {
    return fetchAllCursorPages<IParty>(async (cursor) => {
      const response = await api.get("/party", {
        params: {
          ...(cursor ? { cursor } : {}),
          limit: 100,
        },
      });
      return unwrapPaginatedResponse<IParty>(response);
    });
  },

  create: async (politicianData: any): Promise<ApiResponse<IPolitician>> => {
    const transformedData = buildPoliticianPayload(politicianData);
    const response = await api.post("/politician", transformedData);
    return toApiResponse(response.data, unwrapResponseData<IPolitician>(response));
  },

  update: async (
    id: string,
    politicianData: any,
  ): Promise<ApiResponse<IPolitician>> => {
    const transformedData = buildPoliticianPayload(politicianData);
    const response = await api.put(`/politician/${id}`, transformedData);
    return toApiResponse(response.data, unwrapResponseData<IPolitician>(response));
  },

  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/politician/${id}`);
    return response.data;
  },

  createPoliticianAccount: async (
    politicianId: string,
    data: { email: string },
  ) => {
    await api.post(`/admin/politician/${politicianId}/create-account`, data);
  },

  // Update individual sections
  updatePromises: async (
    _id: string,
    _promises: any[],
  ): Promise<ApiResponse<IPolitician>> => {
    return unsupportedRoute("Politician promise updates");
  },

  updateAchievements: async (
    _id: string,
    _achievements: any[],
  ): Promise<ApiResponse<IPolitician>> => {
    return unsupportedRoute("Politician achievement updates");
  },

  updateExperiences: async (
    _id: string,
    _experiences: any[],
  ): Promise<ApiResponse<IPolitician>> => {
    return unsupportedRoute("Politician experience updates");
  },
};

// Party API
export const partyApi = {
  getAll: async (): Promise<IParty[]> => {
    return politicsApi.getParties();
  },

  getById: async (id: string): Promise<ApiResponse<IParty>> => {
    const response = await api.get(`/party/${id}`);
    return response.data;
  },

  create: async (partyData: any): Promise<ApiResponse<IParty>> => {
    const response = await api.post("/party", partyData);
    return response.data;
  },

  update: async (id: string, partyData: any): Promise<ApiResponse<IParty>> => {
    const response = await api.put(`/party/${id}`, partyData);
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/party/${id}`);
    return response.data;
  },

  getPoliticiansByParty: async (
    partyId: string,
  ): Promise<ApiResponse<IPolitician[]>> => {
    const data = await fetchAllCursorPages<IPolitician>(async (cursor) => {
      const response = await api.get(`/politician`, {
        params: {
          partyId,
          ...(cursor ? { cursor } : {}),
          limit: 100,
        },
      });
      return unwrapPaginatedResponse<IPolitician>(response);
    });
    return toApiResponse(undefined, data);
  },
};

// Geographic API
export const geographicApi = {
  // Provinces
  getProvinces: async (
    cursor?: string | null,
    limit?: number,
  ): Promise<PaginatedResponse<IProvince>> => {
    const response = await api.get("/province", {
      params: {
        ...(cursor ? { cursor } : {}),
        limit: limit || DEFAULT_LIST_LIMIT,
      },
    });
    return unwrapPaginatedResponse<IProvince>(response);
  },

  getProvince: async (provinceId: string): Promise<{ data: IProvince }> => {
    const response = await api.get(`/province/${provinceId}`);
    return { data: unwrapResponseData<IProvince>(response) };
  },

  getProvinceById: async (provinceId: string): Promise<{ data: IProvince }> => {
    const response = await api.get(`/province/${provinceId}`);
    return { data: unwrapResponseData<IProvince>(response) };
  },

  getAllProvincesList: async (): Promise<IProvince[]> => {
    return fetchAllCursorPages<IProvince>((cursor) =>
      geographicApi.getProvinces(cursor, 100),
    );
  },

  createProvince: async (provinceData: any): Promise<{ data: IProvince }> => {
    const response = await api.post("/admin/province", provinceData);
    return response.data;
  },

  // Districts
  getDistricts: async (
    cursor?: string | null,
    limit?: number,
  ): Promise<PaginatedResponse<IDistrict>> => {
    const response = await api.get("/district", {
      params: {
        ...(cursor ? { cursor } : {}),
        limit: limit || DEFAULT_LIST_LIMIT,
      },
    });
    return unwrapPaginatedResponse<IDistrict>(response);
  },

  getDistrictsByProvinceId: async (
    provinceId: string,
    cursor?: string | null,
    limit?: number,
  ): Promise<PaginatedResponse<IDistrict>> => {
    const response = await api.get(`/district/province/${provinceId}`, {
      params: {
        ...(cursor ? { cursor } : {}),
        limit: limit || DEFAULT_LIST_LIMIT,
      },
    });
    return unwrapPaginatedResponse<IDistrict>(response);
  },

  getDistrictById: async (districtId: string): Promise<{ data: IDistrict }> => {
    const response = await api.get(`/district/${districtId}`);
    return { data: unwrapResponseData<IDistrict>(response) };
  },

  createDistrict: async (districtData: any): Promise<{ data: IDistrict }> => {
    const response = await api.post("/admin/district", districtData);
    return response.data;
  },

  getAllDistrictsByProvinceIdList: async (
    provinceId: string,
  ): Promise<IDistrict[]> => {
    return fetchAllCursorPages<IDistrict>((cursor) =>
      geographicApi.getDistrictsByProvinceId(provinceId, cursor, 100),
    );
  },

  // Municipalities
  getMunicipalities: async (
    cursor?: string | null,
    limit?: number,
  ): Promise<PaginatedResponse<IMunicipality>> => {
    const response = await api.get("/municipality", {
      params: {
        ...(cursor ? { cursor } : {}),
        limit: limit || DEFAULT_LIST_LIMIT,
      },
    });
    return unwrapPaginatedResponse<IMunicipality>(response);
  },

  getMunicipalitiesByProvinceId: async (
    provinceId: string,
    cursor?: string | null,
    limit?: number,
  ): Promise<PaginatedResponse<IMunicipality>> => {
    const response = await api.get(`/municipality/province/${provinceId}`, {
      params: {
        ...(cursor ? { cursor } : {}),
        limit: limit || DEFAULT_LIST_LIMIT,
      },
    });
    return unwrapPaginatedResponse<IMunicipality>(response);
  },

  getMunicipalitiesByDistrictId: async (
    districtId: string,
    cursor?: string | null,
    limit?: number,
  ): Promise<PaginatedResponse<IMunicipality>> => {
    const response = await api.get(`/municipality/district/${districtId}`, {
      params: {
        ...(cursor ? { cursor } : {}),
        limit: limit || DEFAULT_LIST_LIMIT,
      },
    });
    return unwrapPaginatedResponse<IMunicipality>(response);
  },

  getAllMunicipalitiesByDistrictIdList: async (
    districtId: string,
  ): Promise<IMunicipality[]> => {
    return fetchAllCursorPages<IMunicipality>((cursor) =>
      geographicApi.getMunicipalitiesByDistrictId(districtId, cursor, 100),
    );
  },

  // Wards
  getWards: async (
    cursor?: string | null,
    limit?: number,
  ): Promise<PaginatedResponse<IWard>> => {
    const response = await api.get("/ward", {
      params: {
        ...(cursor ? { cursor } : {}),
        limit: limit || DEFAULT_LIST_LIMIT,
      },
    });
    return unwrapPaginatedResponse<IWard>(response);
  },

  getWardsByProvinceId: async (
    provinceId: string,
    cursor?: string | null,
    limit?: number,
  ): Promise<PaginatedResponse<IWard>> => {
    const response = await api.get(`/ward/province/${provinceId}`, {
      params: {
        ...(cursor ? { cursor } : {}),
        limit: limit || DEFAULT_LIST_LIMIT,
      },
    });
    return unwrapPaginatedResponse<IWard>(response);
  },

  getWardsByDistrictId: async (
    districtId: string,
    cursor?: string | null,
    limit?: number,
  ): Promise<PaginatedResponse<IWard>> => {
    const response = await api.get(`/ward/district/${districtId}`, {
      params: {
        ...(cursor ? { cursor } : {}),
        limit: limit || DEFAULT_LIST_LIMIT,
      },
    });
    return unwrapPaginatedResponse<IWard>(response);
  },

  getWardsByMunicipalityId: async (
    municipalityId: string,
    cursor?: string | null,
    limit?: number,
  ): Promise<PaginatedResponse<IWard>> => {
    const response = await api.get(`/ward/municipality/${municipalityId}`, {
      params: {
        ...(cursor ? { cursor } : {}),
        limit: limit || DEFAULT_LIST_LIMIT,
      },
    });
    return unwrapPaginatedResponse<IWard>(response);
  },

  getWardById: async (wardId: string): Promise<{ data: IWard }> => {
    const response = await api.get(`/ward/${wardId}`);
    return { data: unwrapResponseData<IWard>(response) };
  },

  createWard: async (wardData: any): Promise<{ data: IWard }> => {
    const response = await api.post("/admin/ward", wardData);
    return response.data;
  },

  getAllWardsByMunicipalityIdList: async (
    municipalityId: string,
  ): Promise<IWard[]> => {
    return fetchAllCursorPages<IWard>((cursor) =>
      geographicApi.getWardsByMunicipalityId(municipalityId, cursor, 100),
    );
  },

  // Constituencies
  getConstituencies: async (
    cursor?: string | null,
    limit?: number,
  ): Promise<PaginatedResponse<IConstituency>> => {
    const response = await api.get("/constituency", {
      params: {
        ...(cursor ? { cursor } : {}),
        limit: limit || DEFAULT_LIST_LIMIT,
      },
    });
    return unwrapPaginatedResponse<IConstituency>(response);
  },

  getConstituenciesByProvinceId: async (
    provinceId: string,
    cursor?: string | null,
    limit?: number,
  ): Promise<PaginatedResponse<IConstituency>> => {
    const response = await api.get(`/constituency/province/${provinceId}`, {
      params: {
        ...(cursor ? { cursor } : {}),
        limit: limit || DEFAULT_LIST_LIMIT,
      },
    });
    return unwrapPaginatedResponse<IConstituency>(response);
  },

  getConstituenciesByDistrictId: async (
    districtId: string,
    cursor?: string | null,
    limit?: number,
  ): Promise<PaginatedResponse<IConstituency>> => {
    const response = await api.get(`/constituency/district/${districtId}`, {
      params: {
        ...(cursor ? { cursor } : {}),
        limit: limit || DEFAULT_LIST_LIMIT,
      },
    });
    return unwrapPaginatedResponse<IConstituency>(response);
  },

  getConstituencyByWardId: async (
    wardId: string,
  ): Promise<{ data: IConstituency }> => {
    const response = await api.get(`/constituency/ward/${wardId}`);
    return { data: unwrapResponseData<IConstituency>(response) };
  },

  getConstituencyById: async (
    constituencyId: string,
  ): Promise<{ data: IConstituency }> => {
    const response = await api.get(`/constituency/${constituencyId}`);
    return { data: unwrapResponseData<IConstituency>(response) };
  },

  getConstituenciesByDistrict: async (
    districtId: string,
    cursor?: string | null,
    limit?: number,
  ): Promise<PaginatedResponse<IConstituency>> => {
    const response = await api.get(`/constituency/district/${districtId}`, {
      params: {
        ...(cursor ? { cursor } : {}),
        limit: limit || DEFAULT_LIST_LIMIT,
      },
    });
    return unwrapPaginatedResponse<IConstituency>(response);
  },

  createConstituency: async (
    constituencyData: any,
  ): Promise<{ data: IConstituency }> => {
    const response = await api.post("/admin/constituency", constituencyData);
    return response.data;
  },
};

// Reports API
export const reportsApi = {
  getAll: async (_params?: {
    status?: string[];
    priority?: string[];
    visibility?: string[];
    type?: string[];
  },
  pagination?: {
    cursor?: string | null;
    limit?: number;
  }): Promise<PaginatedResponse<IReport>> => {
    const response = await api.post("/admin/report/filter", {
      ...(pagination?.cursor ? { cursor: pagination.cursor } : {}),
      limit: pagination?.limit || DEFAULT_LIST_LIMIT,
      ...(_params || {}),
    });
    return unwrapPaginatedResponse<IReport>(response);
  },

  // Admin update report endpoint
  adminUpdateReport: async (
    id: string,
    data: {
      priorityId?: string;
      typeId?: string;
      statusId?: string;
      visibilityId?: string;
      comment?: string;
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
  ): Promise<ApiResponse<IReport>> => {
    if (status === "rejected") {
      return reportsApi.reject(id, comment);
    }

    if (status === "resolved") {
      return reportsApi.resolve(id, comment);
    }

    const response = await api.put(`/admin/report/${id}`, { comment, status });
    const refreshed = await reportsApi.getById(id);
    return toApiResponse(response.data, refreshed);
  },

  approve: async (
    id: string,
    politicianIds: string[],
    comment?: string,
    escalateToHigher?: boolean,
  ): Promise<ApiResponse<IReport>> => {
    const response = await api.post(`/report/${id}/approve`, {
      politicianIds,
      escalateToHigher: escalateToHigher || false,
      notes: comment,
    });
    return toApiResponse(response.data, unwrapResponseData<IReport>(response));
  },

  getApprovalSuggestions: async (
    id: string,
  ): Promise<ApiResponse<ApprovalSuggestionsResponse>> => {
    const response = await api.get(
      `/admin/report/${id}/politician-suggestions`,
    );
    return toApiResponse(
      response.data,
      unwrapResponseData<ApprovalSuggestionsResponse>(response),
    );
  },

  reject: async (
    id: string,
    comment?: string,
  ): Promise<ApiResponse<IReport>> => {
    const response = await api.post(`/admin/report/${id}/reject`, { comment });
    const refreshed = await reportsApi.getById(id);
    return toApiResponse(response.data, refreshed);
  },

  resolve: async (
    id: string,
    comment?: string,
  ): Promise<ApiResponse<IReport>> => {
    const response = await api.post(`/admin/report/${id}/resolve`, { comment });
    const refreshed = await reportsApi.getById(id);
    return toApiResponse(response.data, refreshed);
  },

  delete: async (id: string) => {
    const response = await api.delete(`/report/${id}`);
    return response;
  },

  getActivities: async (
    id: string,
    cursor?: string | null,
    limit = 20,
  ): Promise<PaginatedResponse<any>> => {
    const response = await api.get(`/admin/report/${id}/activities`, {
      params: {
        ...(cursor ? { cursor } : {}),
        limit,
      },
    });
    return unwrapPaginatedResponse<any>(response);
  },

  getRecentActivities: async (limit = 10): Promise<any[]> => {
    const response = await api.get("/admin/report/activities/recent", {
      params: { limit },
    });
    return unwrapResponseData<any[]>(response);
  },

  updatePriority: async (
    _id: string,
    _priority: string,
    _comment?: string,
  ): Promise<ApiResponse<IReport>> => {
    return unsupportedRoute("Report priority updates");
  },

  updateVisibility: async (
    _id: string,
    _publicVisibility: string,
    _comment?: string,
  ): Promise<ApiResponse<IReport>> => {
    return unsupportedRoute("Report visibility updates");
  },

  updateReportType: async (
    _id: string,
    _reportType: string,
    _comment?: string,
  ): Promise<ApiResponse<IReport>> => {
    return unsupportedRoute("Report type updates");
  },
};

// Report Types API
export const reportTypesApi = {
  getAll: async (): Promise<IReportType[]> => {
    return fetchAllCursorPages<IReportType>(async (cursor) => {
      const response = await api.get("/admin/report/types", {
        params: {
          ...(cursor ? { cursor } : {}),
          limit: 100,
        },
      });
      return unwrapPaginatedResponse<IReportType>(response);
    });
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
    return fetchAllCursorPages<IReportStatus>(async (cursor) => {
      const response = await api.get("/admin/report/statuses", {
        params: {
          ...(cursor ? { cursor } : {}),
          limit: 100,
        },
      });
      return unwrapPaginatedResponse<IReportStatus>(response);
    });
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
    return fetchAllCursorPages<IReportPriority>(async (cursor) => {
      const response = await api.get("/admin/report/priorities", {
        params: {
          ...(cursor ? { cursor } : {}),
          limit: 100,
        },
      });
      return unwrapPaginatedResponse<IReportPriority>(response);
    });
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
    return fetchAllCursorPages<IReportVisibility>(async (cursor) => {
      const response = await api.get("/admin/report/visibilities", {
        params: {
          ...(cursor ? { cursor } : {}),
          limit: 100,
        },
      });
      return unwrapPaginatedResponse<IReportVisibility>(response);
    });
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
    limit?: number;
  }): Promise<PaginatedResponse<IHistoricalEvent>> => {
    const allEvents = await fetchAllCursorPages<IHistoricalEvent>(async (cursor) => {
      const response = await api.get("/event", {
        params: {
          ...(cursor ? { cursor } : {}),
          limit: params?.limit || 100,
        },
      });
      return unwrapPaginatedResponse<IHistoricalEvent>(response);
    });
    const data = allEvents.filter((event) => {
      const matchesCategory =
        !params?.category || event.category === params.category;
      const matchesYear = !params?.year || event.year === params.year;

      return matchesCategory && matchesYear;
    });
    return {
      data,
      total: data.length,
      limit: params?.limit || data.length || 1,
      nextCursor: null,
      hasNext: false,
    };
  },

  getById: async (id: string): Promise<ApiResponse<IHistoricalEvent>> => {
    const response = await api.get(`/event/${id}`);
    return toApiResponse(response.data, unwrapResponseData<IHistoricalEvent>(response));
  },

  create: async (
    eventData: Partial<IHistoricalEvent>,
  ): Promise<ApiResponse<IHistoricalEvent>> => {
    const response = await api.post("/event", eventData);
    return toApiResponse(response.data, unwrapResponseData<IHistoricalEvent>(response));
  },

  update: async (
    id: string,
    eventData: Partial<IHistoricalEvent>,
  ): Promise<ApiResponse<IHistoricalEvent>> => {
    const response = await api.put(`/event/${id}`, eventData);
    return toApiResponse(response.data, unwrapResponseData<IHistoricalEvent>(response));
  },

  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/event/${id}`);
    return response.data;
  },
};

// Major Cases API
export const majorCasesApi = {
  getAll: async (params?: {
    status?: string;
    priority?: string;
    search?: string;
    cursor?: string | null;
    limit?: number;
  }): Promise<PaginatedResponse<IMajorCase>> => {
    const response = await api.get("/admin/case", { params });
    return toPagination(unwrapPaginatedResponse<IMajorCase>(response));
  },

  getById: async (id: string): Promise<ApiResponse<IMajorCase>> => {
    const response = await api.get(`/admin/case/${id}`);
    return toApiResponse(response.data, unwrapResponseData<IMajorCase>(response));
  },

  create: async (
    caseData: Partial<IMajorCase>,
  ): Promise<ApiResponse<IMajorCase>> => {
    const response = await api.post("/admin/case", toMajorCasePayload(caseData));
    return toApiResponse(response.data, unwrapResponseData<IMajorCase>(response));
  },

  update: async (
    id: string,
    caseData: Partial<IMajorCase>,
  ): Promise<ApiResponse<IMajorCase>> => {
    const response = await api.put(
      `/admin/case/${id}`,
      toMajorCasePayload(caseData),
    );
    return toApiResponse(response.data, unwrapResponseData<IMajorCase>(response));
  },

  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/admin/case/${id}`);
    return toApiResponse(response.data, undefined as void);
  },

  updateStatus: async (
    id: string,
    status: string,
  ): Promise<ApiResponse<IMajorCase>> => {
    const response = await api.put(`/admin/case/${id}/status`, { status });
    return toApiResponse(response.data, unwrapResponseData<IMajorCase>(response));
  },
};

// Polling API
export const pollingApi = {
  getAll: async (filters?: IPollFilters): Promise<PaginatedResponse<IPoll>> => {
    const data = await fetchAllCursorPages<IPoll>(async (cursor) => {
      const response = await api.get("/poll", {
        params: {
          ...(filters || {}),
          ...(cursor ? { cursor } : {}),
          limit: 100,
        },
      });
      return unwrapPaginatedResponse<IPoll>(response);
    });

    return toPagination({
      data,
      total: data.length,
      limit: data.length || 1,
      nextCursor: null,
      hasNext: false,
    });
  },

  getById: async (id: string): Promise<ApiResponse<IPoll>> => {
    const response = await api.get(`/poll/${id}`);
    return toApiResponse(response.data, unwrapResponseData<IPoll>(response));
  },

  create: async (pollData: ICreatePollData): Promise<ApiResponse<IPoll>> => {
    const response = await api.post(
      "/poll",
      toPollPayload(pollData, { includeStartDate: true }),
    );
    return toApiResponse(response.data, unwrapResponseData<IPoll>(response));
  },

  update: async (
    id: string,
    pollData: IUpdatePollData,
  ): Promise<ApiResponse<IPoll>> => {
    const response = await api.put(`/poll/${id}`, toPollPayload(pollData));
    return toApiResponse(response.data, unwrapResponseData<IPoll>(response));
  },

  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/poll/${id}`);
    return response.data;
  },

  addOption: async (
    id: string,
    option: { option: string },
  ): Promise<ApiResponse<IPollOption>> => {
    const existingPoll = await pollingApi.getById(id);
    const updatedPoll = await pollingApi.update(id, {
      title: existingPoll.data.title,
      description: existingPoll.data.description,
      status: existingPoll.data.status,
      end_date: existingPoll.data.endDate,
      requires_verification: existingPoll.data.requiresVerification,
      options: [
        ...existingPoll.data.options.map((item) => item.text),
        option.option,
      ],
    } as unknown as IUpdatePollData);

    const createdOption = updatedPoll.data.options.find(
      (item) => item.text === option.option,
    );

    return toApiResponse(
      updatedPoll,
      createdOption || {
        id: "",
        text: option.option,
        disabled: false,
        isVoted: false,
        voteCount: 0,
        percentage: 0,
      },
    );
  },

  vote: async (
    pollId: string,
    optionId: string,
  ): Promise<ApiResponse<IPollVote>> => {
    const response = await api.post(`/poll/${pollId}/vote/${optionId}`);
    return response.data;
  },

  getAnalytics: async (): Promise<ApiResponse<IPollAnalytics>> => {
    const response = await api.get("/poll/analytics");
    return response.data;
  },

  getPoliticianComparison: async (
    _politicianId: string,
  ): Promise<ApiResponse<IPollComparison[]>> => {
    return unsupportedRoute("Poll politician comparison");
  },

  getPartyComparison: async (
    _partyId: string,
  ): Promise<ApiResponse<IPollComparison[]>> => {
    return unsupportedRoute("Poll party comparison");
  },

  getCategories: async (): Promise<ApiResponse<string[]>> => {
    const response = await api.get("/poll/categories");
    return toApiResponse(response.data, unwrapResponseData<string[]>(response));
  },

  getStatuses: async (): Promise<ApiResponse<string[]>> => {
    const response = await api.get("/poll/statuses");
    return toApiResponse(response.data, unwrapResponseData<string[]>(response));
  },

  getTypes: async (): Promise<ApiResponse<string[]>> => {
    const response = await api.get("/poll/types");
    return toApiResponse(response.data, unwrapResponseData<string[]>(response));
  },

  createCategory: async (_data: { name: string; name_nepali?: string }) => {
    return Promise.resolve({
      success: true,
      data: { name: _data.name },
      message: "Poll categories are derived from existing poll data.",
    });
  },

  createPoliticianAccount: async (
    politicianId: string,
    data: { email: string },
  ): Promise<ApiResponse<any>> => {
    const response = await api.post(
      `/admin/politician/${politicianId}/create-account`,
      data,
    );
    return response.data;
  },

  createType: async (_data: { name: string; name_nepali?: string }) => {
    return Promise.resolve({
      success: true,
      data: { name: _data.name },
      message: "Poll types are derived from existing poll data.",
    });
  },
};

// User API
export const userApi = {
  getAll: async (
    cursor?: string | null,
    limit?: number,
  ): Promise<PaginatedResponse<IUser>> => {
    const response = await api.get("/admin/user", {
      params: {
        ...(cursor ? { cursor } : {}),
        limit: limit || DEFAULT_LIST_LIMIT,
      },
    });
    return unwrapPaginatedResponse<IUser>(response);
  },

  getById: async (id: string): Promise<ApiResponse<IUser>> => {
    const response = await api.get(`/admin/user/${id}`);
    return response.data;
  },

  update: async (
    id: string,
    userData: Partial<IUser>,
  ): Promise<ApiResponse<IUser>> => {
    const response = await api.put(`/admin/user/${id}`, userData);
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/admin/user/${id}`);
    return response.data;
  },

  getProfile: async (): Promise<ApiResponse<ProfilePayload>> => {
    const response = await api.get("/admin/user/profile");
    return response.data;
  },

  updateProfile: async (
    userData: Partial<IUser>,
  ): Promise<ApiResponse<ProfilePayload>> => {
    const response = await api.put("/admin/user/profile", userData);
    return response.data;
  },
};

export default api;
