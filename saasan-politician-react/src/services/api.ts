// API service functions for politician portal
// Following the same standards as citizen-app and admin-dashboard

import type { AuthPayload, ProfilePayload } from "@/types/auth";
import type {
  AnnouncementDto,
  PoliticianPreferencesDto,
  PromiseDto,
} from "@/types/api";
import axios from "axios";

declare module "axios" {
  export interface InternalAxiosRequestConfig {
    _retry?: boolean;
  }
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const unsupportedRoute = <T>(feature: string): Promise<T> => {
  return Promise.reject(
    new Error(`${feature} is not implemented in the backend yet.`),
  );
};

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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
      !originalRequest.url?.includes("/politician/auth/login") &&
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

const refreshAccessToken = async (): Promise<string | null> => {
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

// Types for API responses
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

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
  payload: ApiResponse<T>,
): ApiResponse<T> => ({
  ...payload,
  data: {
    ...payload.data,
    permissions: normalizePermissions(payload.data?.permissions),
  },
});

const unwrapResponseData = <T>(response: { data: T | ApiResponse<T> }): T => {
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

const normalizePromise = (promise: any): PromiseDto => ({
  ...promise,
  id: promise?.id || promise?._id,
});

const normalizeAnnouncement = (announcement: any): AnnouncementDto => ({
  ...announcement,
  id: announcement?.id || announcement?._id,
  politicianId:
    announcement?.politicianId?.toString?.() || announcement?.politicianId || "",
  createdBy:
    announcement?.createdBy?.toString?.() || announcement?.createdBy || "",
});

const normalizeMessageThread = (thread: any): MessageThread => ({
  ...thread,
  id: thread?.id || thread?._id,
  urgency: String(thread?.urgency || "").toLowerCase() as any,
  status: String(thread?.status || "").toLowerCase() as any,
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
      senderType: String(message?.senderType || "").toLowerCase() as any,
    })) || [],
});

// Message Types
export interface MessageThread {
  id: string;
  _id?: string;
  subject: string;
  content: string;
  category: "complaint" | "suggestion" | "question" | "request";
  urgency: "low" | "medium" | "high";
  status: "pending" | "in_progress" | "resolved" | "closed";
  jurisdiction: {
    provinceId?: string;
    districtId?: string;
    constituencyId?: string;
    municipalityId?: string;
    wardId?: string;
  };
  participants: {
    citizen: {
      id: string;
      name: string;
      email: string;
      location: {
        provinceId?: string;
        districtId?: string;
        constituencyId?: string;
        municipalityId?: string;
        wardId?: string;
      };
    };
    politician: {
      id: string;
      name: string;
    };
    politicians?: Array<{
      id: string;
      name: string;
    }>;
    assignedStaff?: Array<{
      id: string;
      name: string;
      role: string;
    }>;
  };
  messages: Array<{
    id: string;
    senderId: string;
    senderType: "citizen" | "politician" | "staff";
    content: string;
    attachments?: Array<{
      id: string;
      fileName: string;
      fileType: string;
      fileUrl: string;
      uploadedBy: string;
      uploadedAt: string;
    }>;
    isInternal?: boolean;
    createdAt: string;
    readAt?: string;
    upvotesCount?: number;
    downvotesCount?: number;
    viewsCount?: number;
  }>;
  lastMessageAt: string;
  assignedToOfficerId?: string;
  upvotesCount?: number;
  downvotesCount?: number;
  viewsCount?: number;
  referenceNumber: string;
  tags: string[];
  isAnonymous: boolean;
  sourceReportId?: string;
  messageOrigin?: "citizen_created" | "report_converted" | "report_escalated";
  createdAt: string;
  updatedAt: string;
}

export interface ReportDiscussionComment {
  id: string;
  content: string;
  depth: number;
  upvotesCount: number;
  downvotesCount: number;
  currentUserVote: "up" | "down" | null;
  createdAt: string;
  updatedAt: string;
  parentCommentId?: string | null;
  threadRootCommentId?: string | null;
  canReply: boolean;
  author: {
    id: string;
    role: string;
    displayName: string;
    isReportOwner: boolean;
  };
  replies: ReportDiscussionComment[];
}

export interface ReportDiscussionThread {
  reportId: string;
  hasJoined: boolean;
  participantCount: number;
  canCreateTopLevelComment: boolean;
  comments: ReportDiscussionComment[];
}

export interface CreateMessageData {
  subject: string;
  content: string;
  category: "complaint" | "suggestion" | "question" | "request";
  urgency: "low" | "medium" | "high";
  jurisdiction: {
    provinceId?: string;
    districtId?: string;
    constituencyId?: string;
    municipalityId?: string;
    wardId?: string;
  };
  participants: {
    citizenId: string;
    politicianId: string;
    assignedStaffIds?: string[];
  };
  assignedToOfficerId?: string;
  tags?: string[];
  isAnonymous?: boolean;
  initialMessage?: {
    content: string;
    attachments?: Array<{
      fileName: string;
      fileType: string;
      fileUrl: string;
    }>;
  };
}

export interface MessageQueryParams {
  search?: string;
  category?: "complaint" | "suggestion" | "question" | "request";
  urgency?: "low" | "medium" | "high";
  status?: "pending" | "in_progress" | "resolved" | "closed";
  provinceId?: string;
  districtId?: string;
  constituencyId?: string;
  municipalityId?: string;
  wardId?: string;
  page?: number;
  limit?: number;
}

// Dashboard API
export const dashboardApi = {
  getStats: async (): Promise<ApiResponse<any>> => {
    const response = await api.get("/politician/dashboard/stats");
    return response.data;
  },
};

// Messages API - Updated to match backend implementation
export const messagesApi = {
  // Backend currently exposes jurisdiction-scoped fetches for politicians.
  getAll: async (): Promise<MessageThread[]> => {
    const response = await api.get("/message/jurisdiction");
    return unwrapResponseData<any[]>(response).map(normalizeMessageThread);
  },

  // GET /message/jurisdiction - Get messages in politician's jurisdiction
  getJurisdictionMessages: async (): Promise<MessageThread[]> => {
    const response = await api.get("/message/jurisdiction");
    return unwrapResponseData<any[]>(response).map(normalizeMessageThread);
  },

  // GET /message/:messageId - Get single message
  getById: async (messageId: string): Promise<MessageThread> => {
    const response = await api.get(`/message/${messageId}`);
    return normalizeMessageThread(unwrapResponseData(response));
  },

  // POST /message - Create new message (for citizens, but included for completeness)
  create: async (_data: CreateMessageData): Promise<MessageThread> => {
    return unsupportedRoute("Politician-created message threads");
  },

  // PUT /message/:messageId - Update message
  update: async (
    messageId: string,
    data: Partial<CreateMessageData>,
  ): Promise<MessageThread> => {
    await api.put(`/message/${messageId}`, data);
    return messagesApi.getById(messageId);
  },

  // POST /message/:messageId/reply - Add reply to message thread
  addReply: async (
    messageId: string,
    content: string,
    attachments?: any[],
  ): Promise<MessageThread> => {
    const response = await api.post(`/message/${messageId}/reply`, {
      content,
      attachments,
    });
    return normalizeMessageThread(unwrapResponseData(response));
  },

  // PUT /message/:messageId - Update message status (using update endpoint with status)
  updateStatus: async (
    messageId: string,
    status: "pending" | "in_progress" | "resolved" | "closed",
  ): Promise<MessageThread> => {
    await api.put(`/message/${messageId}`, { status: status.toUpperCase() });
    return messagesApi.getById(messageId);
  },

  // POST /message/:messageId/upvote - Upvote a message
  upvoteMessage: async (_messageId: string): Promise<void> => {
    return unsupportedRoute("Message upvotes");
  },

  // POST /message/:messageId/downvote - Downvote a message
  downvoteMessage: async (_messageId: string): Promise<void> => {
    return unsupportedRoute("Message downvotes");
  },
};

export const reportsApi = {
  getDiscussion: async (reportId: string): Promise<ReportDiscussionThread> => {
    const response = await api.get(`/report/${reportId}/discussion`);
    return unwrapResponseData<ReportDiscussionThread>(response);
  },

  joinDiscussion: async (reportId: string): Promise<ReportDiscussionThread> => {
    const response = await api.post(`/report/${reportId}/discussion/join`);
    return unwrapResponseData<ReportDiscussionThread>(response);
  },

  addDiscussionComment: async (
    reportId: string,
    content: string,
  ): Promise<ReportDiscussionThread> => {
    const response = await api.post(`/report/${reportId}/discussion/comments`, {
      content,
    });
    return unwrapResponseData<ReportDiscussionThread>(response);
  },

  replyToDiscussionComment: async (
    reportId: string,
    commentId: string,
    content: string,
  ): Promise<ReportDiscussionThread> => {
    const response = await api.post(
      `/report/${reportId}/discussion/comments/${commentId}/reply`,
      { content },
    );
    return unwrapResponseData<ReportDiscussionThread>(response);
  },

  voteOnDiscussionComment: async (
    reportId: string,
    commentId: string,
    direction: "up" | "down",
  ): Promise<ReportDiscussionThread> => {
    const response = await api.put(
      `/report/${reportId}/discussion/comments/${commentId}/vote`,
      { direction },
    );
    return unwrapResponseData<ReportDiscussionThread>(response);
  },
};

export const promisesApi = {
  getAll: async (): Promise<PromiseDto[]> => {
    const response = await api.get("/politician/portal/promises");
    return unwrapResponseData<any[]>(response).map(normalizePromise);
  },
  update: async (
    id: string,
    data: {
      title: string;
      description: string;
      status: "not-started" | "in-progress" | "fulfilled";
      dueDate: string;
      progress: number;
    },
  ): Promise<PromiseDto> => {
    const response = await api.put(`/politician/portal/promises/${id}`, data);
    return normalizePromise(unwrapResponseData(response));
  },
  create: async (data: {
    title: string;
    description: string;
    status: "not-started" | "in-progress" | "fulfilled";
    dueDate: string;
    progress: number;
  }): Promise<PromiseDto> => {
    const response = await api.post("/politician/portal/promises", data);
    return normalizePromise(unwrapResponseData(response));
  },
  remove: async (id: string): Promise<void> => {
    await api.delete(`/politician/portal/promises/${id}`);
  },
};

export const announcementsApi = {
  getAll: async (): Promise<AnnouncementDto[]> => {
    const response = await api.get("/politician/portal/announcements");
    return unwrapResponseData<any[]>(response).map(normalizeAnnouncement);
  },
  create: async (data: {
    title: string;
    content: string;
    type: "notice" | "update" | "achievement" | "meeting";
    priority: "low" | "medium" | "high";
    isPublic?: boolean;
    scheduledAt?: string | null;
  }): Promise<AnnouncementDto> => {
    const response = await api.post("/politician/portal/announcements", data);
    return normalizeAnnouncement(unwrapResponseData(response));
  },
  update: async (
    id: string,
    data: {
      title: string;
      content: string;
      type: "notice" | "update" | "achievement" | "meeting";
      priority: "low" | "medium" | "high";
      isPublic?: boolean;
      scheduledAt?: string | null;
    },
  ): Promise<AnnouncementDto> => {
    const response = await api.put(
      `/politician/portal/announcements/${id}`,
      data,
    );
    return normalizeAnnouncement(unwrapResponseData(response));
  },
  remove: async (id: string): Promise<void> => {
    await api.delete(`/politician/portal/announcements/${id}`);
  },
};

// Auth API
export const authApi = {
  login: async (
    email: string,
    password: string,
  ): Promise<ApiResponse<AuthPayload>> => {
    const response = await api.post("/politician/auth/login", {
      email: email.trim().toLowerCase(),
      password,
    });
    return normalizeAuthResponse(response.data);
  },

  getProfile: async (): Promise<ApiResponse<ProfilePayload>> => {
    const response = await api.get("/politician/user/profile");
    return normalizeAuthResponse(response.data);
  },

  logout: () => {
    void sessionApi.logoutCurrentSession().finally(() => {
      clearTokens();
    });
  },
};

export interface AuthSessionDto {
  id: string;
  refreshExpiresAt: string;
  revokedAt?: string;
  revokedReason?: string;
  lastUsedAt?: string;
  ipAddress?: string;
  userAgent?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const sessionApi = {
  getMySessions: async (): Promise<ApiResponse<AuthSessionDto[]>> => {
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

export const profileApi = {
  get: async (): Promise<ProfilePayload> => {
    const response = await api.get("/politician/user/profile");
    return normalizeAuthResponse(response.data).data;
  },
  update: async (data: any): Promise<ProfilePayload> => {
    const response = await api.put("/politician/user/profile", data);
    return normalizeAuthResponse(response.data).data;
  },
};

export const settingsApi = {
  updatePreferences: async (
    data: PoliticianPreferencesDto,
  ): Promise<ProfilePayload> => {
    const response = await api.put(
      "/politician/user/settings/preferences",
      data,
    );
    return normalizeAuthResponse(response.data).data;
  },

  changePassword: async (data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<ApiResponse<null>> => {
    const response = await api.post("/politician/user/settings/password", data);
    return response.data;
  },

  exportData: async (): Promise<any> => {
    const response = await api.get("/politician/user/settings/export");
    return unwrapResponseData(response);
  },

  deleteAccount: async (currentPassword: string): Promise<ApiResponse<null>> => {
    const response = await api.delete("/politician/user/settings/account", {
      data: { currentPassword },
    });
    return response.data;
  },
};
