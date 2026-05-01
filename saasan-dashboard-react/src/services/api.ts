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

declare module "axios" {
  export interface InternalAxiosRequestConfig {
    _retry?: boolean;
  }
}

// Utility function to transform snake_case to camelCase
const transformPolitician = (politician: IPolitician) => ({
  id: politician.id,
  fullName: politician.fullName,
  experienceYears: politician.experienceYears,
  party: politician.isIndependent
    ? "Independent"
    : politician.sourceCategories?.party || "",
  constituencyNumber: politician.constituencyNumber,
  rating: politician.rating || 0,
  createdAt: politician.createdAt,
  updatedAt: politician.updatedAt,
  isIndependent: politician.isIndependent,
  totalReports: politician.totalReports,
  verifiedReports: politician.verifiedReports,
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
  partyId: politician.partyId,
  constituencyId: politician.constituencyId,
  status: politician.status,
  joinedDate: politician.joinedDate,
  experiences: politician.experiences,
  promises: politician.promises,
  achievements: politician.achievements,
  sourceCategories: politician.sourceCategories,
  hasAccount: politician.hasAccount,
  accountCreatedAt: politician.accountCreatedAt,
});

// Keep the admin client aligned with the backend DTO contract.
const transformPoliticianForApi = (data: Partial<IPolitician> | any) => {
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
  sharesCount: data.sharesCount,
  autoConvertedToMessage: data.autoConvertedToMessage,
  awaitingPoliticianReply: data.awaitingPoliticianReply,
  targetPoliticianId: data.targetPoliticianId,
  assignedPoliticianIds: data.assignedPoliticianIds || [],
  escalatedToPoliticianId: data.escalatedToPoliticianId,
  resolvedAt: data.resolvedAt,
  createdAt: data.createdAt,
  updatedAt: data.updatedAt,
  statusUpdates: data.statusUpdates,
  sourceCategories: data.sourceCategories,
});

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

const normalizePermissions = (permissions: unknown): string[] => {
  if (Array.isArray(permissions)) {
    return permissions;
  }

  if (
    permissions &&
    typeof permissions === "object" &&
    Array.isArray((permissions as { permissions?: unknown }).permissions)
  ) {
    return (permissions as { permissions: string[] }).permissions;
  }

  return [];
};

const normalizeAuthResponse = <T extends AuthPayload | ProfilePayload>(
  response: ApiResponse<T>,
): ApiResponse<T> => ({
  ...response,
  data: {
    ...response.data,
    permissions: normalizePermissions(response.data?.permissions),
  },
});

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

const normalizeMessageThread = (thread: any): IMessageThread => ({
  ...thread,
  id: thread?.id || thread?._id,
  participants: {
    ...thread?.participants,
    politician: {
      id:
        thread?.participants?.politician?.id ||
        thread?.participants?.politicians?.[0]?.id ||
        "",
      name:
        thread?.participants?.politician?.name ||
        thread?.participants?.politicians?.[0]?.name ||
        "Representative",
    },
    politicians:
      thread?.participants?.politicians ||
      (thread?.participants?.politician
        ? [thread.participants.politician]
        : []),
  },
  messages:
    thread?.messages?.map((message: any) => ({
      ...message,
      id: message?.id || message?._id,
    })) || [],
});

const toPagination = <T>(
  payload: PaginatedResponse<T>,
): PaginatedResponse<T> => ({
  ...payload,
  totalPages:
    payload.totalPages ||
    Math.max(
      1,
      Math.ceil((payload.total || 0) / Math.max(payload.limit || 1, 1)),
    ),
});

const normalizePoll = (poll: any): IPoll => {
  const totalVotes =
    poll?.totalVotes ||
    poll?.options?.reduce(
      (sum: number, option: any) => sum + (option?.voteCount || 0),
      0,
    ) ||
    0;

  return {
    id: poll?.id || poll?._id,
    title: poll?.title || "",
    description: poll?.description || "",
    type: poll?.type || "single-choice",
    status: poll?.status || "active",
    category: poll?.category || "general",
    startDate: poll?.startDate,
    endDate: poll?.endDate,
    createdBy: poll?.createdBy,
    totalVotes,
    requiresVerification: Boolean(poll?.requiresVerification),
    options:
      poll?.options?.map((option: any) => ({
        id: option?.id || option?._id,
        text: option?.text || "",
        disabled: false,
        isVoted: Boolean(option?.isVoted),
        voteCount: option?.voteCount || 0,
        percentage:
          totalVotes > 0
            ? Math.round(((option?.voteCount || 0) / totalVotes) * 100)
            : 0,
      })) || [],
    createdAt: poll?.createdAt,
    updatedAt: poll?.updatedAt,
  };
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

const normalizeHistoricalEvent = (event: any): IHistoricalEvent => ({
  id: event?.id || event?._id,
  date: event?.date,
  title: event?.title || "",
  description: event?.description || "",
  year: event?.date
    ? new Date(event.date).getFullYear()
    : new Date().getFullYear(),
  category: event?.category || "general",
  significance: event?.significance || "medium",
  createdAt: event?.createdAt,
  updatedAt: event?.updatedAt,
});

const normalizeJobRecord = (job: any): IJobRecord => ({
  ...job,
  id: job?.id || job?._id,
});

const normalizeBudget = (budget: any): IBudget => ({
  ...budget,
  id: budget?.id || budget?._id,
});

const toNumericValue = (value: any): number => {
  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  if (value && typeof value === "object") {
    if (typeof value.$numberDecimal === "string") {
      const parsed = Number(value.$numberDecimal);
      return Number.isFinite(parsed) ? parsed : 0;
    }

    if (typeof value.toString === "function") {
      const parsed = Number(value.toString());
      return Number.isFinite(parsed) ? parsed : 0;
    }
  }

  return 0;
};

const normalizeMajorCase = (caseRecord: any): IMajorCase => ({
  id: caseRecord?.id || caseRecord?._id,
  referenceNumber: caseRecord?.referenceNumber || "",
  title: caseRecord?.title || "",
  description: caseRecord?.description || "",
  status: caseRecord?.status || "unsolved",
  priority: caseRecord?.priority || "medium",
  amountInvolved: toNumericValue(caseRecord?.amountInvolved),
  upvotesCount: Number(caseRecord?.upvotesCount || 0),
  downvotesCount: Number(caseRecord?.downvotesCount || 0),
  viewsCount: Number(caseRecord?.viewsCount || 0),
  sharesCount: Number(caseRecord?.sharesCount || 0),
  peopleAffectedCount: Number(caseRecord?.peopleAffectedCount || 0),
  dateOccurred: caseRecord?.dateOccurred,
  locationDescription: caseRecord?.locationDescription || "",
  provinceId: caseRecord?.provinceId || undefined,
  districtId: caseRecord?.districtId || undefined,
  constituencyId: caseRecord?.constituencyId || undefined,
  municipalityId: caseRecord?.municipalityId || undefined,
  wardId: caseRecord?.wardId || undefined,
  isPublic: Boolean(caseRecord?.isPublic),
  createdAt: caseRecord?.createdAt,
  updatedAt: caseRecord?.updatedAt,
});

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
    return normalizeAuthResponse(response.data);
  },

  refreshToken: async (
    refreshToken: string,
  ): Promise<ApiResponse<AuthPayload>> => {
    const response = await api.post("/auth/refresh-token", { refreshToken });
    return normalizeAuthResponse(response.data);
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
    return normalizeAuthResponse(response.data);
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
    return toApiResponse(
      response.data,
      (unwrapResponseData<any[]>(response) || []).map(normalizeJobRecord),
    );
  },

  retry: async (jobId: string): Promise<ApiResponse<{ jobId: string }>> => {
    const response = await api.post(`/admin/jobs/${jobId}/retry`);
    return response.data;
  },
};

export const budgetApi = {
  getAll: async (): Promise<ApiResponse<IBudget[]>> => {
    const response = await api.get("/budget");
    return toApiResponse(
      response.data,
      (unwrapResponseData<any[]>(response) || []).map(normalizeBudget),
    );
  },
};

export const messageThreadApi = {
  getByReportId: async (reportId: string): Promise<ApiResponse<IMessageThread>> => {
    const response = await api.get(`/message/report/${reportId}`);
    return toApiResponse(
      response.data,
      normalizeMessageThread(unwrapResponseData(response)),
    );
  },

  addReply: async (
    messageId: string,
    content: string,
  ): Promise<ApiResponse<IMessageThread>> => {
    const response = await api.post(`/message/${messageId}/reply`, { content });
    return toApiResponse(
      response.data,
      normalizeMessageThread(unwrapResponseData(response)),
    );
  },
};

// Dashboard API
export const dashboardApi = {
  getStats: async (): Promise<ApiResponse<IDashboardStats>> => {
    const response = await api.get("/admin/dashboard/stats");
    return response.data;
  },

  getMajorCases: async (): Promise<ApiResponse<IMajorCase[]>> => {
    const response = await majorCasesApi.getAll({ page: 1, limit: 5 });
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
  ): Promise<PaginatedResponse<IPolitician>> => {
    const response = await api.post("/politician/filter", body || {});
    const transformedData = response.data.data?.map(transformPolitician) || [];
    return {
      ...response.data,
      data: transformedData,
    };
  },

  getById: async (id: string): Promise<ApiResponse<IPolitician>> => {
    const response = await api.get(`/politician/${id}`);
    return {
      ...response.data,
      data: transformPolitician(response.data.data),
    };
  },

  getByLevel: async (
    level: string,
    params?: Partial<IPolitician>,
  ): Promise<PaginatedResponse<IPolitician>> => {
    const response = await api.get(`/politician/level/${level}`, { params });
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

  create: async (politicianData: any): Promise<ApiResponse<IPolitician>> => {
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
  ): Promise<ApiResponse<IPolitician>> => {
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
    const response = await api.get("/party");
    return response.data.data;
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
    const response = await api.get(`/politician?partyId=${partyId}`);
    const transformedData = response.data.data?.map(transformPolitician) || [];
    return {
      ...response.data,
      data: transformedData,
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
    return { data: unwrapResponseData<IProvince>(response) };
  },

  getProvinceById: async (provinceId: string): Promise<{ data: IProvince }> => {
    const response = await api.get(`/province/${provinceId}`);
    return { data: unwrapResponseData<IProvince>(response) };
  },

  createProvince: async (provinceData: any): Promise<{ data: IProvince }> => {
    const response = await api.post("/admin/province", provinceData);
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
    return { data: unwrapResponseData<IDistrict>(response) };
  },

  createDistrict: async (districtData: any): Promise<{ data: IDistrict }> => {
    const response = await api.post("/admin/district", districtData);
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
    return { data: unwrapResponseData<IWard>(response) };
  },

  createWard: async (wardData: any): Promise<{ data: IWard }> => {
    const response = await api.post("/admin/ward", wardData);
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
  }): Promise<IReport[]> => {
    const response = await api.post("/admin/report/filter", _params || {});
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
    const approvedReport =
      response.data?.report ||
      response.data?.data?.report ||
      response.data?.data ||
      response.data;
    return toApiResponse(response.data, transformReport(approvedReport));
  },

  getApprovalSuggestions: async (
    id: string,
  ): Promise<ApiResponse<ApprovalSuggestionsResponse>> => {
    const response = await api.get(
      `/admin/report/${id}/politician-suggestions`,
    );

    return {
      ...response.data,
      data: {
        ...response.data.data,
        suggestedPoliticians:
          response.data.data?.suggestedPoliticians?.map(transformPolitician) ||
          [],
      },
    };
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
    page = 1,
    limit = 20,
  ): Promise<PaginatedResponse<any>> => {
    const response = await api.get(`/admin/report/${id}/activities`, {
      params: { page, limit },
    });
    const payload = unwrapResponseData<PaginatedResponse<any>>(response);
    return toPagination(payload);
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
  }): Promise<PaginatedResponse<IHistoricalEvent>> => {
    const response = await api.get("/event", { params });
    const allEvents =
      (unwrapResponseData<any[]>(response) || []).map(normalizeHistoricalEvent);
    const data = allEvents.filter((event) => {
      const matchesCategory =
        !params?.category || event.category === params.category;
      const matchesYear = !params?.year || event.year === params.year;

      return matchesCategory && matchesYear;
    });
    return {
      data,
      total: data.length,
      page: params?.page || 1,
      limit: params?.limit || data.length || 1,
      totalPages: 1,
    };
  },

  getById: async (id: string): Promise<ApiResponse<IHistoricalEvent>> => {
    const response = await api.get(`/event/${id}`);
    return toApiResponse(
      response.data,
      normalizeHistoricalEvent(unwrapResponseData(response)),
    );
  },

  create: async (
    eventData: Partial<IHistoricalEvent>,
  ): Promise<ApiResponse<IHistoricalEvent>> => {
    const response = await api.post("/event", eventData);
    return toApiResponse(
      response.data,
      normalizeHistoricalEvent(unwrapResponseData(response)),
    );
  },

  update: async (
    id: string,
    eventData: Partial<IHistoricalEvent>,
  ): Promise<ApiResponse<IHistoricalEvent>> => {
    const response = await api.put(`/event/${id}`, eventData);
    return toApiResponse(
      response.data,
      normalizeHistoricalEvent(unwrapResponseData(response)),
    );
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
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<IMajorCase>> => {
    const response = await api.get("/admin/case", { params });
    const payload = unwrapResponseData<PaginatedResponse<any>>(response);
    return toPagination({
      ...payload,
      data: (payload?.data || []).map(normalizeMajorCase),
    });
  },

  getById: async (id: string): Promise<ApiResponse<IMajorCase>> => {
    const response = await api.get(`/admin/case/${id}`);
    return toApiResponse(
      response.data,
      normalizeMajorCase(unwrapResponseData(response)),
    );
  },

  create: async (
    caseData: Partial<IMajorCase>,
  ): Promise<ApiResponse<IMajorCase>> => {
    const response = await api.post("/admin/case", toMajorCasePayload(caseData));
    return toApiResponse(
      response.data,
      normalizeMajorCase(unwrapResponseData(response)),
    );
  },

  update: async (
    id: string,
    caseData: Partial<IMajorCase>,
  ): Promise<ApiResponse<IMajorCase>> => {
    const response = await api.put(
      `/admin/case/${id}`,
      toMajorCasePayload(caseData),
    );
    return toApiResponse(
      response.data,
      normalizeMajorCase(unwrapResponseData(response)),
    );
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
    return toApiResponse(
      response.data,
      normalizeMajorCase(unwrapResponseData(response)),
    );
  },
};

// Polling API
export const pollingApi = {
  getAll: async (filters?: IPollFilters): Promise<PaginatedResponse<IPoll>> => {
    const response = await api.get("/poll", { params: filters });
    const payload = unwrapResponseData<PaginatedResponse<any>>(response);
    return toPagination({
      ...payload,
      data: (payload?.data || []).map(normalizePoll),
    });
  },

  getById: async (id: string): Promise<ApiResponse<IPoll>> => {
    const response = await api.get(`/poll/${id}`);
    return toApiResponse(
      response.data,
      normalizePoll(unwrapResponseData(response)),
    );
  },

  create: async (pollData: ICreatePollData): Promise<ApiResponse<IPoll>> => {
    const response = await api.post(
      "/poll",
      toPollPayload(pollData, { includeStartDate: true }),
    );
    return toApiResponse(
      response.data,
      normalizePoll(unwrapResponseData(response)),
    );
  },

  update: async (
    id: string,
    pollData: IUpdatePollData,
  ): Promise<ApiResponse<IPoll>> => {
    const response = await api.put(`/poll/${id}`, toPollPayload(pollData));
    return toApiResponse(
      response.data,
      normalizePoll(unwrapResponseData(response)),
    );
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
    page?: number,
    limit?: number,
  ): Promise<PaginatedResponse<IUser>> => {
    const url =
      page && limit
        ? `/admin/user?page=${page}&limit=${limit}`
        : "/admin/user";
    const response = await api.get(url);
    return response.data.data;
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
    return normalizeAuthResponse(response.data);
  },

  updateProfile: async (
    userData: Partial<IUser>,
  ): Promise<ApiResponse<ProfilePayload>> => {
    const response = await api.put("/admin/user/profile", userData);
    return normalizeAuthResponse(response.data);
  },
};

export default api;
