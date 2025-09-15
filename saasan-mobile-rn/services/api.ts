import AsyncStore from "@react-native-async-storage/async-storage";
import { GovernmentLevel, Politician } from "~/hooks/usePoliticians";
import {
  CorruptionReport,
  Evidence,
  ReportCreateData,
  ReportFilters,
  ReportUpdateData,
} from "~/types/reports";
import {
  Poll,
  PollFilters,
  CreatePollData,
  UpdatePollData,
  PollVote,
} from "~/types/polling";

// Utility function to transform poll data from backend format to frontend format
const transformPoll = (data: any): Poll => ({
  id: data.id,
  title: data.title,
  description: data.description,
  type: data.type,
  status: data.status,
  category: data.category,
  options: data.options?.map((option: any) => ({
    id: option.id,
    text: option.option, // Backend uses 'option', frontend expects 'text'
    votes_count: option.votes || 0, // Backend uses 'votes', frontend expects 'votes_count'
    percentage: 0, // Will be calculated later
  })) || [],
  total_votes: data.total_votes || 0,
  start_date: data.start_date,
  end_date: data.end_date || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // Default to 7 days from now if null
  created_by: data.created_by,
  created_at: data.created_at,
  updated_at: data.updated_at,
  user_vote: data.user_vote,
  is_anonymous: data.is_anonymous || false,
  requires_verification: data.requires_verification || false,
  district: data.district,
  municipality: data.municipality,
  ward: data.ward,
});

const BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || "http://localhost:5000/api/v1";

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  district?: string;
  municipality?: string;
  wardNumber?: number;
}

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: string;
  phone?: string;
  district?: string;
  municipality?: string;
  ward_number?: number;
  last_active_at: string;
  created_at: string;
  updated_at: string;
}

interface DashboardStats {
  overview: {
    totalReports: number;
    resolvedReports: number;
    resolutionRate: number;
    activePoliticians: number;
    totalPoliticians: number;
  };
  categoryBreakdown: Array<{
    categoryName: string;
    count: number;
  }>;
}

interface MajorCase {
  id: string;
  title: string;
  description: string;
  amountInvolved: number;
  status: string;
  createdAt: string;
  upvotesCount: number;
  referenceNumber: string;
  priority: string;
}

interface LiveService {
  id: string;
  serviceType: string;
  status: string;
}

class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = BASE_URL;
  }

  private async getAuthToken(): Promise<string | null> {
    return await AsyncStore.getItem("auth_token");
  }

  private async setAuthToken(token: string): Promise<void> {
    await AsyncStore.setItem("auth_token", token);
  }

  private async removeAuthToken(): Promise<void> {
    await AsyncStore.removeItem("auth_token");
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const token = await this.getAuthToken();

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const res = await fetch(`${this.baseURL}${endpoint}`, config);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || `API Error: ${res.status}`);
      }

      return data;
    } catch (error) {
      throw error instanceof Error
        ? error
        : new Error("Unknown error occurred");
    }
  }

  // Auth APIs
  async login(
    data: LoginData
  ): Promise<ApiResponse<{ token: string; user: UserProfile }>> {
    const response = await this.request<{ token: string; user: UserProfile }>(
      "/auth/login",
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );
    await this.setAuthToken(response.data.token);
    return response;
  }

  async register(
    data: RegisterData
  ): Promise<ApiResponse<{ token: string; user: UserProfile }>> {
    const response = await this.request<{ token: string; user: UserProfile }>(
      "/auth/register",
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );
    await this.setAuthToken(response.data.token);
    return response;
  }

  async logout(): Promise<void> {
    await this.removeAuthToken();
  }

  async getProfile(): Promise<ApiResponse<UserProfile>> {
    return this.request<UserProfile>("/auth/profile");
  }

  // Dashboard APIs
  async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    return this.request<DashboardStats>("/dashboard/stats");
  }

  async getMajorCases(): Promise<ApiResponse<MajorCase[]>> {
    return this.request<MajorCase[]>("/dashboard/major-cases");
  }

  async getLiveServices(): Promise<ApiResponse<LiveService[]>> {
    return this.request<LiveService[]>("/dashboard/live-services");
  }

  // Politicians APIs
  async getPoliticians(level: string): Promise<ApiResponse<Politician[]>> {
    try {
      // Use the level-based endpoint if level is specified
      if (level && level !== 'all') {
        // Convert to lowercase for the endpoint
        const lowercaseLevel = level.toLowerCase();
        return this.request<Politician[]>(`/politicians/level/${lowercaseLevel}`);
      } else {
        return this.request<Politician[]>("/politicians");
      }
    } catch (error) {
      console.error("Error fetching politicians:", error);
      throw error;
    }
  }

  async getPoliticianById(id: string): Promise<ApiResponse<Politician>> {
    return this.request<Politician>(`/politicians/${id}`);
  }

  async getGovernmentLevels(): Promise<ApiResponse<GovernmentLevel[]>> {
    return this.request<GovernmentLevel[]>("/politicians/levels");
  }

  async ratePolitician(id: string, rating: number): Promise<ApiResponse<void>> {
    return this.request<void>(`/politicians/${id}/rate`, {
      method: "POST",
      body: JSON.stringify({ rating }),
    });
  }

  // Location APIs
  async getDistricts(): Promise<ApiResponse<{ id: string; name: string }[]>> {
    return this.request<{ id: string; name: string }[]>("/locations/districts");
  }

  async getMunicipalities(
    districtId: string
  ): Promise<ApiResponse<{ id: string; name: string }[]>> {
    return this.request<{ id: string; name: string }[]>(
      `/locations/districts/${districtId}/municipalities`
    );
  }

  async getWards(
    districtId: string,
    municipalityId: string
  ): Promise<ApiResponse<number[]>> {
    return this.request<number[]>(
      `/locations/districts/${districtId}/municipalities/${municipalityId}/wards`
    );
  }

  // Reports APIs
  async createReport(
    data: ReportCreateData
  ): Promise<ApiResponse<CorruptionReport>> {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === "evidence" && value) {
        value.forEach((file: File) => {
          formData.append("evidence", file);
        });
      } else {
        formData.append(key, value as string);
      }
    });

    return this.request<CorruptionReport>("/reports", {
      method: "POST",
      body: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  async getAllReports(
    filters?: ReportFilters
  ): Promise<ApiResponse<CorruptionReport[]>> {
    const queryParams = filters
      ? "?" +
        Object.entries(filters)
          .filter(([_, value]) => value)
          .map(
            ([key, value]) =>
              `${key}=${encodeURIComponent(JSON.stringify(value))}`
          )
          .join("&")
      : "";

    return this.request<CorruptionReport[]>(`/reports${queryParams}`);
  }

  async getReportById(id: string): Promise<ApiResponse<CorruptionReport>> {
    return this.request<CorruptionReport>(`/reports/${id}`);
  }

  async getUserReports(): Promise<ApiResponse<CorruptionReport[]>> {
    return this.request<CorruptionReport[]>("/reports/my-reports");
  }

  async updateReportStatus(
    id: string,
    data: ReportUpdateData
  ): Promise<ApiResponse<CorruptionReport>> {
    return this.request<CorruptionReport>(`/reports/${id}/status`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async uploadEvidence(
    reportId: string,
    evidence: File[]
  ): Promise<ApiResponse<Evidence[]>> {
    const formData = new FormData();
    evidence.forEach((file) => {
      formData.append("evidence", file);
    });

    return this.request<Evidence[]>(`/reports/${reportId}/evidence`, {
      method: "PUT",
      body: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  async voteOnReport(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/reports/${id}/vote`, {
      method: "POST",
    });
  }

  // Polling APIs
  async createPoll(data: CreatePollData): Promise<ApiResponse<Poll>> {
    return this.request<Poll>("/polls", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getAllPolls(filters?: PollFilters): Promise<ApiResponse<Poll[]>> {
    const queryParams = filters
      ? "?" +
        Object.entries(filters)
          .filter(([_, value]) => value)
          .map(
            ([key, value]) =>
              `${key}=${encodeURIComponent(JSON.stringify(value))}`
          )
          .join("&")
      : "";

    const response = await this.request<any[]>(`/polls${queryParams}`);
    return {
      ...response,
      data: response.data?.map(transformPoll) || [],
    };
  }

  async getPollById(id: string): Promise<ApiResponse<Poll>> {
    const response = await this.request<any>(`/polls/${id}`);
    return {
      ...response,
      data: transformPoll(response.data),
    };
  }

  async getUserPolls(): Promise<ApiResponse<Poll[]>> {
    const response = await this.request<any[]>("/polls/my-polls");
    return {
      ...response,
      data: response.data?.map(transformPoll) || [],
    };
  }

  async updatePoll(
    id: string,
    data: UpdatePollData
  ): Promise<ApiResponse<Poll>> {
    const response = await this.request<any>(`/polls/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return {
      ...response,
      data: transformPoll(response.data),
    };
  }

  async deletePoll(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/polls/${id}`, {
      method: "DELETE",
    });
  }

  async voteOnPoll(
    pollId: string,
    optionId: string | string[]
  ): Promise<ApiResponse<PollVote>> {
    // Handle single choice polls
    if (typeof optionId === 'string') {
      return this.request<PollVote>(`/polls/${pollId}/vote/${optionId}`, {
        method: "POST",
      });
    }
    // Handle multiple choice polls - vote on each option separately
    const results = [];
    for (const id of optionId) {
      const result = await this.request<PollVote>(`/polls/${pollId}/vote/${id}`, {
        method: "POST",
      });
      results.push(result.data);
    }
    return {
      success: true,
      data: results as any,
    };
  }

  async getPollResults(id: string): Promise<ApiResponse<Poll>> {
    // Use the same endpoint as getPollById since there's no separate results endpoint
    return this.getPollById(id);
  }

  async getPollCategories(): Promise<ApiResponse<string[]>> {
    return this.request<string[]>("/polls/categories");
  }
}

export const apiService = new ApiService();
