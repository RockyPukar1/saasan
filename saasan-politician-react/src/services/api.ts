// API service functions for politician portal
// Following the same standards as citizen-app and admin-dashboard

import axios from "axios";

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
      localStorage.removeItem("refreshToken");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

// Types for API responses
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Message Types
export interface MessageThread {
  id: string;
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
    const response = await api.get("/dashboard/stats");
    return response.data;
  },
};

// Messages API - Updated to match backend implementation
export const messagesApi = {
  // GET /message - Get all messages
  getAll: async (): Promise<MessageThread[]> => {
    const response = await api.get("/message");
    return response.data;
  },

  // GET /message/jurisdiction - Get messages in politician's jurisdiction
  getJurisdictionMessages: async (): Promise<MessageThread[]> => {
    const response = await api.get("/message/jurisdiction");
    return response.data;
  },

  // GET /message/:messageId - Get single message
  getById: async (messageId: string): Promise<MessageThread> => {
    const response = await api.get(`/message/${messageId}`);
    return response.data;
  },

  // POST /message - Create new message (for citizens, but included for completeness)
  create: async (data: CreateMessageData): Promise<MessageThread> => {
    const response = await api.post("/message", data);
    return response.data;
  },

  // PUT /message/:messageId - Update message
  update: async (
    messageId: string,
    data: Partial<CreateMessageData>,
  ): Promise<MessageThread> => {
    const response = await api.put(`/message/${messageId}`, data);
    return response.data;
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
    return response.data;
  },

  // PUT /message/:messageId - Update message status (using update endpoint with status)
  updateStatus: async (
    messageId: string,
    status: "pending" | "in_progress" | "resolved" | "closed",
  ): Promise<MessageThread> => {
    const response = await api.put(`/message/${messageId}`, { status });
    return response.data;
  },

  // POST /message/:messageId/upvote - Upvote a message
  upvoteMessage: async (messageId: string): Promise<void> => {
    const response = await api.post(`/message/${messageId}/upvote`);
    return response.data;
  },

  // POST /message/:messageId/downvote - Downvote a message
  downvoteMessage: async (messageId: string): Promise<void> => {
    const response = await api.post(`/message/${messageId}/downvote`);
    return response.data;
  },
};

export const promisesApi = {
  getAll: async (): Promise<any[]> => {
    const response = await api.get("/promises");
    return response.data;
  },
  update: async (id: string, data: any): Promise<any> => {
    const response = await api.put(`/promises/${id}`, data);
    return response.data;
  },
  create: async (data: any): Promise<any> => {
    const response = await api.post("/promises", data);
    return response.data;
  },
};

export const announcementsApi = {
  getAll: async (): Promise<any[]> => {
    const response = await api.get("/announcements");
    return response.data;
  },
  create: async (data: any): Promise<any> => {
    const response = await api.post("/announcements", data);
    return response.data;
  },
  update: async (id: string, data: any): Promise<any> => {
    const response = await api.put(`/announcements/${id}`, data);
    return response.data;
  },
};

// Auth API
export const authApi = {
  login: async (
    email: string,
    password: string,
  ): Promise<
    ApiResponse<{ accessToken: string; refreshToken: string; user: any }>
  > => {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  },

  getProfile: async (): Promise<ApiResponse<any>> => {
    const response = await api.get("/user/profile");
    return response.data;
  },

  logout: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  },
};

export const profileApi = {
  get: async (): Promise<any> => {
    const response = await api.get("/profile");
    return response.data;
  },
  update: async (data: any): Promise<any> => {
    const response = await api.put("/profile", data);
    return response.data;
  },
};
