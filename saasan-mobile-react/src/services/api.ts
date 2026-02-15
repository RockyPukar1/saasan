import type {
  ReportCreateData,
  ReportFilters,
  ReportUpdateData,
} from "@/types";
import type {
  Poll,
  PollFilters,
  CreatePollData,
  UpdatePollData,
  PollVote,
} from "@/types";
import {
  getApiHeaders,
  getApiQuery,
  formatApiResponse,
  type Language,
} from "@/lib/bilingual";
import type {
  IGovernmentLevel,
  IParty,
  IPolitician,
  IPoliticianFilter,
  IPosition,
} from "@/types/politics";
import type {
  IProvince,
  IDistrict,
  IMunicipality,
  IWard,
  IConstituency,
} from "@/types/location";
import type { IRegisterData } from "@/types/auth";
import type { IReport } from "@/types/reports";

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
        text: option.text,
        voteCount: option.voteCount,
        isVoted: option.isVoted,
      })) || [],
    totalVotes: formattedData.totalVotes,
    startDate: formattedData.startDate,
    endDate: formattedData.endDate,
    createdAt: formattedData.createdAt,
    updatedAt: formattedData.updated_at,
    requiresVerification: formattedData.requiresVerification,
  };
};

const BASE_URL = import.meta.env.VITE_SAASAN_API_URL!;

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

interface LoginData {
  email: string;
  password: string;
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

export interface DashboardStats {
  overview: {
    totalReportsCount: number;
    resolvedReportsCount: number;
    totalCasesCount: number;
    resolvedCasesCount: number;
    totalPoliticians: number;
    activePoliticians: number;
    reportResolutionRate: number;
    caseResolutionRate: number;
  };
  recentReports: any[];
  recentCases: any[];
  recentEvents: any[];
  eventsOnThisDay: any[];
}

class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = BASE_URL;
  }

  private async getAuthToken(): Promise<string | null> {
    return localStorage.getItem("accessToken");
  }

  private async setAuthToken(
    accessToken: string,
    refreshToken: string,
  ): Promise<void> {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
  }

  private async removeAuthToken(): Promise<void> {
    localStorage.removeItem("accessToken");
  }

  private async request<T>(
    method: string,
    endpoint: string,
    body?: any,
    options: RequestInit = {},
    language: Language = "en",
  ): Promise<ApiResponse<T>> {
    const token = await this.getAuthToken();

    const isFormData = body instanceof FormData;

    const config: RequestInit = {
      method,
      headers: {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...(token && { Authorization: `Bearer ${token}` }),
        ...getApiHeaders(language),
      },
      ...(body && {
        body: isFormData ? body : JSON.stringify(body),
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
      const data = res.status === 204 ? null : await res.json();

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
  async login(data: LoginData): Promise<
    ApiResponse<{
      accessToken: string;
      refreshToken: string;
      user: UserProfile;
    }>
  > {
    const response = await this.request<{
      accessToken: string;
      refreshToken: string;
      user: UserProfile;
    }>("POST", "/auth/login", data);
    await this.setAuthToken(
      response.data.accessToken,
      response.data.refreshToken,
    );
    return response;
  }

  async register(data: IRegisterData): Promise<
    ApiResponse<{
      accessToken: string;
      refreshToken: string;
      user: UserProfile;
    }>
  > {
    const response = await this.request<{
      accessToken: string;
      refreshToken: string;
      user: UserProfile;
    }>("POST", "/auth/register", data);
    await this.setAuthToken(
      response.data.accessToken,
      response.data.refreshToken,
    );
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

  // Politicians APIs
  async getPoliticiansByFilter(
    filter: IPoliticianFilter,
  ): Promise<ApiResponse<IPolitician[]>> {
    try {
      return this.request<IPolitician[]>("POST", "/politician/filter", filter);
    } catch (error) {
      console.error("Error fetching politicians:", error);
      throw error;
    }
  }

  async getPoliticianById(id: string): Promise<ApiResponse<IPolitician>> {
    return this.request<IPolitician>("GET", `/politician/${id}`);
  }

  async getGovernmentLevels(): Promise<ApiResponse<IGovernmentLevel[]>> {
    return this.request<IGovernmentLevel[]>("GET", "/level");
  }

  async getPositions(): Promise<ApiResponse<IPosition[]>> {
    return this.request<IPosition[]>("Get", "/position");
  }

  async getParties(): Promise<ApiResponse<IParty[]>> {
    return this.request<IParty[]>("GET", "/party");
  }

  async ratePolitician(id: string, rating: number): Promise<ApiResponse<void>> {
    return this.request<void>("POST", `/politician/${id}/rate`, { rating });
  }

  // Location APIs
  async getAllProvinces(): Promise<ApiResponse<IProvince[]>> {
    return this.request<IProvince[]>("GET", "/province");
  }

  async getDistrictsByProvinceId(
    provinceId: string,
  ): Promise<ApiResponse<IDistrict[]>> {
    return this.request<IDistrict[]>("GET", `/district/province/${provinceId}`);
  }

  async getConstituencyByWardId(
    wardId: string,
  ): Promise<ApiResponse<IConstituency>> {
    return this.request<IConstituency>("GET", `/constituency/ward/${wardId}`);
  }

  async getMunicipalitiesByDistrictId(
    districtId: string,
  ): Promise<ApiResponse<IMunicipality[]>> {
    return this.request<IMunicipality[]>(
      "GET",
      `/municipality/district/${districtId}`,
    );
  }

  async getWardsByMunicipalityId(
    municipalityId: string,
  ): Promise<ApiResponse<IWard[]>> {
    return this.request<IWard[]>("GET", `/ward/municipality/${municipalityId}`);
  }

  // Reports APIs
  async createReport(
    data: ReportCreateData,
    files: File[],
  ): Promise<ApiResponse<IReport>> {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });

    files.forEach((file) => {
      formData.append("files", file);
    });

    return this.request<IReport>("POST", "/report", formData);
  }

  async getAllReports(
    filters?: ReportFilters,
  ): Promise<ApiResponse<IReport[]>> {
    const queryParams = filters
      ? "?" +
        Object.entries(filters)
          .filter(([_, value]) => value)
          .map(
            ([key, value]) =>
              `${key}=${encodeURIComponent(JSON.stringify(value))}`,
          )
          .join("&")
      : "";

    return this.request<IReport[]>("GET", `/report${queryParams}`);
  }

  async getReportById(id: string): Promise<ApiResponse<IReport>> {
    return this.request<IReport>("GET", `/report/${id}`);
  }

  async getUserReports(): Promise<ApiResponse<IReport[]>> {
    return this.request<IReport[]>("GET", "/report/my-reports");
  }

  async updateReportStatus(
    id: string,
    data: ReportUpdateData,
  ): Promise<ApiResponse<IReport>> {
    return this.request<IReport>("PUT", `/report/${id}/status`, data);
  }

  async voteOnReport(id: string): Promise<ApiResponse<void>> {
    return this.request<void>("POST", `/report/${id}/vote`);
  }

  // Polling APIs
  async createPoll(data: CreatePollData): Promise<ApiResponse<Poll>> {
    return this.request<Poll>("POST", "/poll", data);
  }

  async getAllPolls(filters?: PollFilters): Promise<Poll[]> {
    const queryParams = filters
      ? "?" +
        Object.entries(filters)
          .filter(([_, value]) => value)
          .map(
            ([key, value]) =>
              `${key}=${encodeURIComponent(JSON.stringify(value))}`,
          )
          .join("&")
      : "";

    const response = await this.request<Promise<Poll[]>>(
      "GET",
      `/poll${queryParams}`,
    );
    return response.data;
  }

  async getPollById(id: string): Promise<ApiResponse<Poll>> {
    const response = await this.request<any>("GET", `/poll/${id}`);
    return {
      ...response,
      data: transformPoll(response.data),
    };
  }

  async getUserPolls(): Promise<ApiResponse<Poll[]>> {
    const response = await this.request<any[]>("GET", "/poll/my-polls");
    return {
      ...response,
      data: response.data?.map(transformPoll) || [],
    };
  }

  async updatePoll(
    id: string,
    data: UpdatePollData,
  ): Promise<ApiResponse<Poll>> {
    const response = await this.request<any>("PUT", `/poll/${id}`, data);
    return {
      ...response,
      data: transformPoll(response.data),
    };
  }

  async deletePoll(id: string): Promise<ApiResponse<void>> {
    return this.request<void>("DELETE", `/poll/${id}`);
  }

  async voteOnPoll(
    pollId: string,
    optionId: string | string[],
  ): Promise<ApiResponse<PollVote>> {
    // Handle single choice polls
    if (typeof optionId === "string") {
      return this.request<PollVote>("POST", `/poll/${pollId}/vote/${optionId}`);
    }
    // Handle multiple choice polls - vote on each option separately
    const results = [];
    for (const id of optionId) {
      const result = await this.request<PollVote>(
        "POST",
        `/poll/${pollId}/vote/${id}`,
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
    return this.request<string[]>("GET", "/poll/categories");
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
      `/campaign/voter-registrations?${queryParams.toString()}`,
    );
  }

  async verifyVoterRegistration(
    id: number,
    data: {
      status: "verified" | "rejected";
      notes?: string;
    },
  ): Promise<ApiResponse<any>> {
    return this.request<any>(
      "PUT",
      `/campaign/voter-registrations/${id}/verify`,
      data,
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
      `/campaign/voter-surveys?${queryParams.toString()}`,
    );
  }

  async getCandidatesByConstituency(
    constituencyId: number,
    electionType: string,
  ): Promise<ApiResponse<any[]>> {
    return this.request<any[]>(
      "GET",
      `/campaign/candidates/constituency/${constituencyId}?electionType=${electionType}`,
    );
  }

  async compareCandidatesCampaign(
    candidate1Id: number,
    candidate2Id: number,
    userId: number,
  ): Promise<ApiResponse<any>> {
    return this.request<any>(
      "GET",
      `/campaign/candidates/compare/${candidate1Id}/${candidate2Id}?userId=${userId}`,
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
      `/campaign/analytics?${queryParams.toString()}`,
    );
  }

  async getCampaignDashboard(): Promise<ApiResponse<any>> {
    return this.request<any>("GET", "/campaign/dashboard");
  }

  // Viral APIs
  async generateShareContent(
    data: any,
    userId: string,
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
    userId: string,
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
    period: string,
  ): Promise<ApiResponse<any[]>> {
    return this.request<any[]>(
      "GET",
      `/viral/leaderboard?type=${type}&period=${period}`,
    );
  }

  async getTrendingPolls(limit: number = 10): Promise<ApiResponse<any[]>> {
    return this.request<any[]>("GET", `/viral/trending-polls?limit=${limit}`);
  }

  async voteOnPollViral(
    pollId: string,
    optionId: string,
    userId: string,
  ): Promise<ApiResponse<any>> {
    return this.request<any>("POST", "/viral/vote-poll", {
      pollId,
      optionId,
      userId,
    });
  }

  async getTransparencyFeed(
    limit: number = 20,
    offset: number = 0,
  ): Promise<ApiResponse<any[]>> {
    return this.request<any[]>(
      "GET",
      `/viral/transparency-feed?limit=${limit}&offset=${offset}`,
    );
  }

  async reactToFeed(
    itemId: string,
    itemType: string,
    reaction: string,
    userId: string,
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
    itemType: string,
  ): Promise<ApiResponse<any[]>> {
    return this.request<any[]>(
      "GET",
      `/viral/comments?itemId=${itemId}&itemType=${itemType}`,
    );
  }

  async addComment(
    itemId: string,
    itemType: string,
    content: string,
    userId: string,
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
    userId: string,
  ): Promise<ApiResponse<any>> {
    return this.request<any>("POST", `/viral/comments/${commentId}/reply`, {
      content,
      userId,
    });
  }

  async voteOnComment(
    commentId: string,
    vote: "up" | "down",
    userId: string,
  ): Promise<void> {
    await this.request<void>("POST", `/viral/comments/${commentId}/vote`, {
      vote,
      userId,
    });
  }

  async reportComment(
    commentId: string,
    reason: string,
    userId: string,
  ): Promise<void> {
    await this.request<void>("POST", `/viral/comments/${commentId}/report`, {
      reason,
      userId,
    });
  }

  async getVerificationStatus(
    itemId: string,
    itemType: string,
  ): Promise<ApiResponse<any>> {
    return this.request<any>(
      "GET",
      `/viral/verification-status?itemId=${itemId}&itemType=${itemType}`,
    );
  }

  async voteOnVerification(
    itemId: string,
    itemType: string,
    vote: "verify" | "reject",
    userId: string,
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
      `/viral/candidates?${queryParams.toString()}`,
    );
  }

  async compareCandidatesViral(
    candidate1Id: string,
    candidate2Id: string,
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
        callbacks.forEach((callback) => callback(update)),
      );
    } catch (error) {
      console.error("Error fetching updates:", error);
    }
  }
}

export const apiService = new ApiService();
