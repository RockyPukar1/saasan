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
import {
  getApiHeaders,
  getApiQuery,
  formatApiResponse,
  type Language,
} from "~/lib/bilingual";

// Utility function to transform poll data from backend format to frontend format
const transformPoll = (data: any): Poll => {
  // Format bilingual data
  const formattedData = formatApiResponse(data, "en");

  return {
    id: formattedData.id,
    title: formattedData.title,
    description: formattedData.description,
    type: formattedData.type,
    status: formattedData.status,
    category: formattedData.category,
    options:
      formattedData.options?.map((option: any) => ({
        id: option.id,
        text: option.text || option.option, // Backend uses 'option', frontend expects 'text'
        votes_count: option.votes || 0, // Backend uses 'votes', frontend expects 'votes_count'
        percentage: 0, // Will be calculated later
      })) || [],
    total_votes: formattedData.total_votes || 0,
    start_date: formattedData.start_date,
    end_date:
      formattedData.end_date ||
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // Default to 7 days from now if null
    created_by: formattedData.created_by,
    created_at: formattedData.created_at,
    updated_at: formattedData.updated_at,
    user_vote: formattedData.user_vote,
    is_anonymous: formattedData.is_anonymous || false,
    requires_verification: formattedData.requires_verification || false,
    district: formattedData.district,
    municipality: formattedData.municipality,
    ward: formattedData.ward,
  };
};

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
    method: string,
    endpoint: string,
    body?: any,
    options: RequestInit = {},
    language: Language = "en"
  ): Promise<ApiResponse<T>> {
    const token = await this.getAuthToken();

    const config: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...getApiHeaders(language),
        ...options.headers,
      },
      ...(body && {
        body: typeof body === "string" ? body : JSON.stringify(body),
      }),
      ...options,
    };

    try {
      // Add language query parameter
      const url = new URL(`${this.baseURL}${endpoint}`);
      const queryParams = getApiQuery(language);
      Object.entries(queryParams).forEach(([key, value]) => {
        url.searchParams.set(key, value);
      });

      const res = await fetch(url.toString(), config);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || `API Error: ${res.status}`);
      }

      // Format response data based on language
      const formattedData = formatApiResponse(data, language);
      return formattedData;
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
      "POST",
      "/auth/login",
      data
    );
    await this.setAuthToken(response.data.token);
    return response;
  }

  async register(
    data: RegisterData
  ): Promise<ApiResponse<{ token: string; user: UserProfile }>> {
    const response = await this.request<{ token: string; user: UserProfile }>(
      "POST",
      "/auth/register",
      data
    );
    await this.setAuthToken(response.data.token);
    return response;
  }

  async logout(): Promise<void> {
    await this.removeAuthToken();
  }

  async getProfile(): Promise<ApiResponse<UserProfile>> {
    return this.request<UserProfile>("GET", "/auth/profile");
  }

  // Dashboard APIs
  async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    return this.request<DashboardStats>("GET", "/dashboard/stats");
  }

  async getMajorCases(): Promise<ApiResponse<MajorCase[]>> {
    return this.request<MajorCase[]>("GET", "/dashboard/major-cases");
  }

  async getLiveServices(): Promise<ApiResponse<LiveService[]>> {
    return this.request<LiveService[]>("GET", "/dashboard/live-services");
  }

  // Politicians APIs
  async getPoliticians(level: string): Promise<ApiResponse<Politician[]>> {
    try {
      // Use the level-based endpoint if level is specified
      if (level && level !== "all") {
        // Convert to lowercase for the endpoint
        const lowercaseLevel = level.toLowerCase();
        return this.request<Politician[]>(
          "GET",
          `/politicians/level/${lowercaseLevel}`
        );
      } else {
        return this.request<Politician[]>("GET", "/politicians");
      }
    } catch (error) {
      console.error("Error fetching politicians:", error);
      throw error;
    }
  }

  async getPoliticianById(id: string): Promise<ApiResponse<Politician>> {
    return this.request<Politician>("GET", `/politicians/${id}`);
  }

  async getGovernmentLevels(): Promise<ApiResponse<GovernmentLevel[]>> {
    return this.request<GovernmentLevel[]>("GET", "/politicians/levels");
  }

  async ratePolitician(id: string, rating: number): Promise<ApiResponse<void>> {
    return this.request<void>("POST", `/politicians/${id}/rate`, { rating });
  }

  // Location APIs
  async getDistricts(): Promise<ApiResponse<{ id: string; name: string }[]>> {
    return this.request<{ id: string; name: string }[]>(
      "GET",
      "/locations/districts"
    );
  }

  async getMunicipalities(
    districtId: string
  ): Promise<ApiResponse<{ id: string; name: string }[]>> {
    return this.request<{ id: string; name: string }[]>(
      "GET",
      `/locations/districts/${districtId}/municipalities`
    );
  }

  async getWards(
    districtId: string,
    municipalityId: string
  ): Promise<ApiResponse<number[]>> {
    return this.request<number[]>(
      "GET",
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

    return this.request<CorruptionReport>("POST", "/reports", formData, {
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

    return this.request<CorruptionReport[]>("GET", `/reports${queryParams}`);
  }

  async getReportById(id: string): Promise<ApiResponse<CorruptionReport>> {
    return this.request<CorruptionReport>("GET", `/reports/${id}`);
  }

  async getUserReports(): Promise<ApiResponse<CorruptionReport[]>> {
    return this.request<CorruptionReport[]>("GET", "/reports/my-reports");
  }

  async updateReportStatus(
    id: string,
    data: ReportUpdateData
  ): Promise<ApiResponse<CorruptionReport>> {
    return this.request<CorruptionReport>("PUT", `/reports/${id}/status`, data);
  }

  async uploadEvidence(
    reportId: string,
    evidence: File[]
  ): Promise<ApiResponse<Evidence[]>> {
    const formData = new FormData();
    evidence.forEach((file) => {
      formData.append("evidence", file);
    });

    return this.request<Evidence[]>(
      "PUT",
      `/reports/${reportId}/evidence`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  }

  async voteOnReport(id: string): Promise<ApiResponse<void>> {
    return this.request<void>("POST", `/reports/${id}/vote`);
  }

  // Polling APIs
  async createPoll(data: CreatePollData): Promise<ApiResponse<Poll>> {
    return this.request<Poll>("POST", "/polls", data);
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

    const response = await this.request<any[]>("GET", `/polls${queryParams}`);
    return {
      ...response,
      data: response.data?.map(transformPoll) || [],
    };
  }

  async getPollById(id: string): Promise<ApiResponse<Poll>> {
    const response = await this.request<any>("GET", `/polls/${id}`);
    return {
      ...response,
      data: transformPoll(response.data),
    };
  }

  async getUserPolls(): Promise<ApiResponse<Poll[]>> {
    const response = await this.request<any[]>("GET", "/polls/my-polls");
    return {
      ...response,
      data: response.data?.map(transformPoll) || [],
    };
  }

  async updatePoll(
    id: string,
    data: UpdatePollData
  ): Promise<ApiResponse<Poll>> {
    const response = await this.request<any>("PUT", `/polls/${id}`, data);
    return {
      ...response,
      data: transformPoll(response.data),
    };
  }

  async deletePoll(id: string): Promise<ApiResponse<void>> {
    return this.request<void>("DELETE", `/polls/${id}`);
  }

  async voteOnPoll(
    pollId: string,
    optionId: string | string[]
  ): Promise<ApiResponse<PollVote>> {
    // Handle single choice polls
    if (typeof optionId === "string") {
      return this.request<PollVote>(
        "POST",
        `/polls/${pollId}/vote/${optionId}`
      );
    }
    // Handle multiple choice polls - vote on each option separately
    const results = [];
    for (const id of optionId) {
      const result = await this.request<PollVote>(
        "POST",
        `/polls/${pollId}/vote/${id}`
      );
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
    return this.request<string[]>("GET", "/polls/categories");
  }

  // Campaign APIs
  async registerVoter(data: {
    userId: number;
    constituencyId: number;
    wardId: number;
    registrationNumber: string;
  }): Promise<ApiResponse<any>> {
    return this.request<any>("POST", "/campaign/register-voter", data);
  }

  async getVoterRegistrations(params?: {
    constituencyId?: number;
    userId?: number;
  }): Promise<ApiResponse<any[]>> {
    const queryParams = new URLSearchParams();
    if (params?.constituencyId)
      queryParams.append("constituencyId", params.constituencyId.toString());
    if (params?.userId) queryParams.append("userId", params.userId.toString());

    return this.request<any[]>(
      "GET",
      `/campaign/voter-registrations?${queryParams.toString()}`
    );
  }

  async verifyVoterRegistration(
    id: number,
    data: {
      status: "verified" | "rejected";
      notes?: string;
    }
  ): Promise<ApiResponse<any>> {
    return this.request<any>(
      "PUT",
      `/campaign/voter-registrations/${id}/verify`,
      data
    );
  }

  async submitVoterSurvey(data: {
    userId: number;
    constituencyId: number;
    returnIntent: "returning" | "unsure" | "cannot";
    returnReason?: string;
    votingIntent?: "will_vote" | "might_vote" | "will_not_vote";
    preferredCandidateId?: number;
    concerns?: string[];
    suggestions?: string;
  }): Promise<ApiResponse<any>> {
    return this.request<any>("POST", "/campaign/voter-survey", data);
  }

  async getVoterSurveys(params?: {
    constituencyId?: number;
    userId?: number;
  }): Promise<ApiResponse<any[]>> {
    const queryParams = new URLSearchParams();
    if (params?.constituencyId)
      queryParams.append("constituencyId", params.constituencyId.toString());
    if (params?.userId) queryParams.append("userId", params.userId.toString());

    return this.request<any[]>(
      "GET",
      `/campaign/voter-surveys?${queryParams.toString()}`
    );
  }

  async getCandidatesByConstituency(
    constituencyId: number,
    electionType: string
  ): Promise<ApiResponse<any[]>> {
    return this.request<any[]>(
      "GET",
      `/campaign/candidates/constituency/${constituencyId}?electionType=${electionType}`
    );
  }

  async compareCandidatesCampaign(
    candidate1Id: number,
    candidate2Id: number,
    userId: number
  ): Promise<ApiResponse<any>> {
    return this.request<any>(
      "GET",
      `/campaign/candidates/compare/${candidate1Id}/${candidate2Id}?userId=${userId}`
    );
  }

  async getActiveVotingSessions(): Promise<ApiResponse<any[]>> {
    return this.request<any[]>("GET", "/campaign/voting-sessions/active");
  }

  async castVote(data: {
    sessionId: number;
    candidateId: number;
    userId: number;
  }): Promise<ApiResponse<any>> {
    return this.request<any>("POST", "/campaign/vote", data);
  }

  async getVotingResults(sessionId: number): Promise<ApiResponse<any>> {
    return this.request<any>("GET", `/campaign/voting-results/${sessionId}`);
  }

  async getCampaignAnalytics(params?: {
    constituencyId?: number;
    startDate?: string;
    endDate?: string;
  }): Promise<ApiResponse<any>> {
    const queryParams = new URLSearchParams();
    if (params?.constituencyId)
      queryParams.append("constituencyId", params.constituencyId.toString());
    if (params?.startDate) queryParams.append("startDate", params.startDate);
    if (params?.endDate) queryParams.append("endDate", params.endDate);

    return this.request<any>(
      "GET",
      `/campaign/analytics?${queryParams.toString()}`
    );
  }

  async getCampaignDashboard(): Promise<ApiResponse<any>> {
    return this.request<any>("GET", "/campaign/dashboard");
  }

  // Viral APIs
  async generateShareContent(
    data: any,
    userId: string
  ): Promise<ApiResponse<any>> {
    return this.request<any>("POST", "/viral/generate-share", {
      ...data,
      userId,
    });
  }

  async trackShare(
    itemId: string,
    itemType: string,
    platform: string,
    userId: string
  ): Promise<void> {
    await this.request<void>("POST", "/viral/track-share", {
      itemId,
      itemType,
      platform,
      userId,
    });
  }

  async getBadges(params?: { userId?: string }): Promise<ApiResponse<any[]>> {
    const queryParams = params?.userId ? `?userId=${params.userId}` : "";
    return this.request<any[]>("GET", `/viral/badges${queryParams}`);
  }

  async unlockBadge(badgeId: string): Promise<ApiResponse<any>> {
    return this.request<any>("POST", "/viral/unlock-badge", { badgeId });
  }

  async getLeaderboard(
    type: string,
    period: string
  ): Promise<ApiResponse<any[]>> {
    return this.request<any[]>(
      "GET",
      `/viral/leaderboard?type=${type}&period=${period}`
    );
  }

  async getTrendingPolls(limit: number = 10): Promise<ApiResponse<any[]>> {
    return this.request<any[]>("GET", `/viral/trending-polls?limit=${limit}`);
  }

  async voteOnPollViral(
    pollId: string,
    optionId: string,
    userId: string
  ): Promise<ApiResponse<any>> {
    return this.request<any>("POST", "/viral/vote-poll", {
      pollId,
      optionId,
      userId,
    });
  }

  async getTransparencyFeed(
    limit: number = 20,
    offset: number = 0
  ): Promise<ApiResponse<any[]>> {
    return this.request<any[]>(
      "GET",
      `/viral/transparency-feed?limit=${limit}&offset=${offset}`
    );
  }

  async reactToFeed(
    itemId: string,
    itemType: string,
    reaction: string,
    userId: string
  ): Promise<void> {
    await this.request<void>("POST", "/viral/react-feed", {
      itemId,
      itemType,
      reaction,
      userId,
    });
  }

  async getStreaks(params?: { userId?: string }): Promise<ApiResponse<any>> {
    const queryParams = params?.userId ? `?userId=${params.userId}` : "";
    return this.request<any>("GET", `/viral/streaks${queryParams}`);
  }

  async recordActivity(activity: string, userId: string): Promise<void> {
    await this.request<void>("POST", "/viral/record-activity", {
      activity,
      userId,
    });
  }

  async getComments(
    itemId: string,
    itemType: string
  ): Promise<ApiResponse<any[]>> {
    return this.request<any[]>(
      "GET",
      `/viral/comments?itemId=${itemId}&itemType=${itemType}`
    );
  }

  async addComment(
    itemId: string,
    itemType: string,
    content: string,
    userId: string
  ): Promise<ApiResponse<any>> {
    return this.request<any>("POST", "/viral/comments", {
      itemId,
      itemType,
      content,
      userId,
    });
  }

  async replyToComment(
    commentId: string,
    content: string,
    userId: string
  ): Promise<ApiResponse<any>> {
    return this.request<any>("POST", `/viral/comments/${commentId}/reply`, {
      content,
      userId,
    });
  }

  async voteOnComment(
    commentId: string,
    vote: "up" | "down",
    userId: string
  ): Promise<void> {
    await this.request<void>("POST", `/viral/comments/${commentId}/vote`, {
      vote,
      userId,
    });
  }

  async reportComment(
    commentId: string,
    reason: string,
    userId: string
  ): Promise<void> {
    await this.request<void>("POST", `/viral/comments/${commentId}/report`, {
      reason,
      userId,
    });
  }

  async getVerificationStatus(
    itemId: string,
    itemType: string
  ): Promise<ApiResponse<any>> {
    return this.request<any>(
      "GET",
      `/viral/verification-status?itemId=${itemId}&itemType=${itemType}`
    );
  }

  async voteOnVerification(
    itemId: string,
    itemType: string,
    vote: "verify" | "reject",
    userId: string
  ): Promise<void> {
    await this.request<void>("POST", "/viral/verification-vote", {
      itemId,
      itemType,
      vote,
      userId,
    });
  }

  async getInviteStats(userId: string): Promise<ApiResponse<any>> {
    return this.request<any>("GET", `/viral/invite-stats?userId=${userId}`);
  }

  async trackInvite(inviterId: string, inviteeId: string): Promise<void> {
    await this.request<void>("POST", "/viral/track-invite", {
      inviterId,
      inviteeId,
    });
  }

  async getElectionData(): Promise<ApiResponse<any>> {
    return this.request<any>("GET", "/viral/election-data");
  }

  async getCandidates(params?: {
    constituencyId?: string;
    electionType?: string;
  }): Promise<ApiResponse<any[]>> {
    const queryParams = new URLSearchParams();
    if (params?.constituencyId)
      queryParams.append("constituencyId", params.constituencyId);
    if (params?.electionType)
      queryParams.append("electionType", params.electionType);
    return this.request<any[]>(
      "GET",
      `/viral/candidates?${queryParams.toString()}`
    );
  }

  async compareCandidatesViral(
    candidate1Id: string,
    candidate2Id: string
  ): Promise<ApiResponse<any>> {
    return this.request<any>("POST", "/viral/compare-candidates", {
      candidate1Id,
      candidate2Id,
    });
  }

  async getViralMetrics(): Promise<ApiResponse<any>> {
    return this.request<any>("GET", "/viral/metrics");
  }

  async getUpdates(callbacks: Array<(updates: any) => void>): Promise<void> {
    try {
      const response = await this.request<any>("GET", "/viral/updates");
      const updates = formatApiResponse(response.data, "en");
      updates.forEach((update: any) =>
        callbacks.forEach((callback) => callback(update))
      );
    } catch (error) {
      console.error("Error fetching updates:", error);
    }
  }
}

export const apiService = new ApiService();
