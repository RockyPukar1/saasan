import type { ReportCreateData, ReportUpdateData } from "@/types";
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
import type {
  AuthPayload,
  ProfilePayload,
  AuthSession,
} from "@/types/auth-session";

const BASE_URL = import.meta.env.VITE_SAASAN_API_URL!;

const unsupportedRoute = <T>(feature: string): Promise<T> => {
  return Promise.reject(
    new Error(`${feature} is not implemented in the backend yet.`),
  );
};

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  meta?: {
    pagination?: {
      total: number;
      limit: number;
      nextCursor?: string | null;
      hasNext?: boolean;
    };
  };
}

interface ApiData<T> {
  data: T;
  total?: number;
  limit?: number;
  nextCursor?: string | null;
  hasNext?: boolean;
}

interface LoginData {
  email: string;
  password: string;
}

const DEFAULT_LIST_LIMIT = 50;
const CURSOR_BATCH_LIMIT = 100;

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

const toApiData = <T>(response: ApiResponse<T>): ApiData<T> => ({
  data: response.data,
  total: response.meta?.pagination?.total,
  limit: response.meta?.pagination?.limit,
  nextCursor: response.meta?.pagination?.nextCursor,
  hasNext: response.meta?.pagination?.hasNext,
});

const toPaginatedApiResponse = <T>(
  data: T[],
  message = "Success",
): ApiResponse<T[]> => ({
  success: true,
  data,
  message,
  meta: {
    pagination: {
      total: data.length,
      limit: data.length || 1,
      nextCursor: null,
      hasNext: false,
    },
  },
});

export interface BudgetItem {
  id: string;
  title: string;
  description?: string;
  amount: number;
  department: string;
  year: number;
  status: string;
  category?: string;
}

export interface DashboardStats {
  overview: {
    myReportsCount: number;
    myResolvedReportsCount: number;
    totalPublicReportsCount: number;
    totalPoliticians: number;
    activePoliticians: number;
    myReportResolutionRate: number;
  };
  myRecentReports: any[];
  publicFeed: {
    recentReports: any[];
    recentEvents: any[];
    eventsOnThisDay: any[];
  };
  community: {
    resolvedPublicReportsCount: number;
    publicReportResolutionRate: number;
  };
}

export interface MessageThread {
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

class ApiService {
  private baseURL: string;
  private isRefreshing = false;
  private refreshPromise: Promise<string | null> | null = null;

  constructor() {
    this.baseURL = BASE_URL;
  }

  private async getRefreshToken(): Promise<string | null> {
    return localStorage.getItem("refreshToken");
  }

  private async clearTokens(): Promise<void> {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("sessionId");
  }

  private async refreshAccessToken(): Promise<string | null> {
    const refreshToken = await this.getRefreshToken();

    if (!refreshToken) {
      await this.clearTokens();
      return null;
    }

    try {
      const url = new URL(`${this.baseURL}/auth/refresh-token`);
      const res = await fetch(url.toString(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });

      const data = res.status === 204 ? null : await res.json();

      if (!res.ok || !data?.success) {
        await this.clearTokens();
        return null;
      }

      const newAccessToken = data.data.accessToken;
      const newRefreshToken = data.data.refreshToken;
      const newSessionId = data.data.sessionId;

      await this.setAuthToken(
        newAccessToken,
        newRefreshToken,
        newSessionId,
      );

      return newAccessToken;
    } catch (error) {
      await this.clearTokens();
      return null;
    }
  }

  private async getAuthToken(): Promise<string | null> {
    return localStorage.getItem("accessToken");
  }

  private async setAuthToken(
    accessToken: string,
    refreshToken: string,
    sessionId?: string,
  ): Promise<void> {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    if (sessionId) {
      localStorage.setItem("sessionId", sessionId);
    }
  }

  private async removeAuthToken(): Promise<void> {
    await this.clearTokens();
  }

  async refreshToken(refreshToken: string): Promise<ApiResponse<AuthPayload>> {
    const response = await this.request<AuthPayload>(
      "POST",
      "/auth/refresh-token",
      { refreshToken },
    );

    await this.setAuthToken(
      response.data.accessToken,
      response.data.refreshToken,
      response.data.sessionId,
    );

    return response;
  }

  private async request<T>(
    method: string,
    endpoint: string,
    body?: any,
    options: RequestInit = {},
    language: Language = "en",
    retry = true,
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
      const url = new URL(`${this.baseURL}${endpoint}`);
      const queryParams = getApiQuery(language);

      Object.entries(queryParams).forEach(([key, value]) => {
        url.searchParams.set(key, value);
      });

      const res = await fetch(url.toString(), config);

      if (
        res.status === 401 &&
        retry &&
        !endpoint.includes("/auth/refresh-token") &&
        !endpoint.includes("/citizen/auth/login") &&
        !endpoint.includes("/citizen/auth/register")
      ) {
        let newAccessToken: string | null = null;

        if (!this.isRefreshing) {
          this.isRefreshing = true;
          this.refreshPromise = this.refreshAccessToken();
        }

        newAccessToken = await this.refreshPromise;

        this.isRefreshing = false;
        this.refreshPromise = null;

        if (!newAccessToken) {
          await this.clearTokens();
          throw new Error("Session expired. Please log in again.");
        }

        return this.request<T>(
          method,
          endpoint,
          body,
          options,
          language,
          false,
        );
      }

      const data = res.status === 204 ? null : await res.json();

      if (!res.ok) {
        throw new Error(data?.message || `API Error: ${res.status}`);
      }

      const formattedData = formatApiResponse(data, language);
      return formattedData;
    } catch (error) {
      throw error instanceof Error
        ? error
        : new Error("Unknown error occurred");
    }
  }

  private async fetchAllCursorPages<T>(
    fetchPage: (cursor?: string | null) => Promise<ApiResponse<T[]>>,
  ): Promise<ApiResponse<T[]>> {
    const allItems: T[] = [];
    let cursor: string | null | undefined = null;
    let hasNext = true;
    let message = "Success";

    while (hasNext) {
      const response = await fetchPage(cursor);
      allItems.push(...response.data);
      cursor = response.meta?.pagination?.nextCursor ?? null;
      hasNext = Boolean(response.meta?.pagination?.hasNext && cursor);
      message = response.message || message;
    }

    return toPaginatedApiResponse(allItems, message);
  }

  // Auth APIs
  async login(data: LoginData): Promise<ApiResponse<AuthPayload>> {
    const response = await this.request<AuthPayload>(
      "POST",
      "/citizen/auth/login",
      {
        email: data.email.trim().toLowerCase(),
        password: data.password,
      },
    );
    await this.setAuthToken(
      response.data.accessToken,
      response.data.refreshToken,
      response.data.sessionId,
    );
    return response;
  }

  async register(data: IRegisterData): Promise<ApiResponse<AuthPayload>> {
    const response = await this.request<AuthPayload>(
      "POST",
      "/citizen/auth/register",
      {
        ...data,
        email: data.email.trim().toLowerCase(),
      },
    );
    await this.setAuthToken(
      response.data.accessToken,
      response.data.refreshToken,
      response.data.sessionId,
    );
    return response;
  }

  async logout(): Promise<void> {
    try {
      await this.request<null>("POST", "/auth/logout");
    } catch (error) {
      // Ignore logout API failure and still clear local auth state.
    } finally {
      await this.removeAuthToken();
    }
  }

  async getProfile(): Promise<ApiResponse<ProfilePayload>> {
    const response = await this.request<ProfilePayload>(
      "GET",
      "/citizen/user/profile",
    );
    return response;
  }

  async getMySessions(): Promise<ApiResponse<AuthSession[]>> {
    return this.request<AuthSession[]>("GET", "/auth/sessions");
  }

  async revokeSession(sessionId: string): Promise<ApiResponse<null>> {
    return this.request<null>("DELETE", `/auth/sessions/${sessionId}`);
  }

  async revokeAllOtherSessions(): Promise<ApiResponse<null>> {
    return this.request<null>("POST", "/auth/sessions/revoke-all");
  }

  getCurrentSessionId(): string | null {
    return localStorage.getItem("sessionId");
  }

  // Dashboard APIs
  async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    return this.request<DashboardStats>("GET", "/citizen/dashboard/stats");
  }

  async getReportThread(reportId: string): Promise<ApiResponse<MessageThread>> {
    const response = await this.request<MessageThread>(
      "GET",
      `/message/report/${reportId}`,
    );

    return toApiResponse(response, response.data);
  }

  async replyToMessageThread(
    messageId: string,
    content: string,
  ): Promise<ApiResponse<MessageThread>> {
    const response = await this.request<MessageThread>(
      "POST",
      `/message/${messageId}/reply`,
      {
        content,
      },
    );

    return toApiResponse(response, response.data);
  }

  async joinReportDiscussion(
    reportId: string,
  ): Promise<ApiResponse<ReportDiscussionThread>> {
    const response = await this.request<ReportDiscussionThread>(
      "POST",
      `/report/${reportId}/discussion/join`,
    );
    return toApiResponse(response, (response as any).data || response);
  }

  async getReportDiscussion(
    reportId: string,
  ): Promise<ApiResponse<ReportDiscussionThread>> {
    const response = await this.request<ReportDiscussionThread>(
      "GET",
      `/report/${reportId}/discussion`,
    );
    return toApiResponse(response, (response as any).data || response);
  }

  async addReportDiscussionComment(
    reportId: string,
    content: string,
  ): Promise<ApiResponse<ReportDiscussionThread>> {
    const response = await this.request<ReportDiscussionThread>(
      "POST",
      `/report/${reportId}/discussion/comments`,
      { content },
    );
    return toApiResponse(response, (response as any).data || response);
  }

  async replyToReportDiscussionComment(
    reportId: string,
    commentId: string,
    content: string,
  ): Promise<ApiResponse<ReportDiscussionThread>> {
    const response = await this.request<ReportDiscussionThread>(
      "POST",
      `/report/${reportId}/discussion/comments/${commentId}/reply`,
      { content },
    );
    return toApiResponse(response, (response as any).data || response);
  }

  async voteOnReportDiscussionComment(
    reportId: string,
    commentId: string,
    direction: "up" | "down",
  ): Promise<ApiResponse<ReportDiscussionThread>> {
    const response = await this.request<ReportDiscussionThread>(
      "PUT",
      `/report/${reportId}/discussion/comments/${commentId}/vote`,
      { direction },
    );
    return toApiResponse(response, (response as any).data || response);
  }

  async getBudgets(): Promise<ApiResponse<BudgetItem[]>> {
    const response = await this.fetchAllCursorPages<any>((cursor) =>
      this.request<any[]>(
        "GET",
        `/budget?limit=${CURSOR_BATCH_LIMIT}${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ""}`,
      ),
    );
    return {
      ...response,
      data:
        response.data?.map((item) => ({
          id: item._id || item.id,
          title: item.title,
          description: item.description,
          amount: item.amount,
          department: item.department,
          year: item.year,
          status: item.status,
          category: item.category,
        })) || [],
    };
  }

  // Politicians APIs
  async getPoliticiansByFilter(
    filter: IPoliticianFilter & { cursor?: string | null; limit?: number },
  ): Promise<ApiResponse<IPolitician[]>> {
    try {
      return this.request<IPolitician[]>("POST", "/politician/filter", {
        limit: DEFAULT_LIST_LIMIT,
        ...filter,
      });
    } catch (error) {
      console.error("Error fetching politicians:", error);
      throw error;
    }
  }

  async getPoliticianById(id: string): Promise<ApiResponse<IPolitician>> {
    return this.request<IPolitician>("GET", `/politician/${id}`);
  }

  async getPoliticiansByParty(
    partyId: string,
  ): Promise<ApiResponse<IPolitician[]>> {
    try {
      return this.fetchAllCursorPages<IPolitician>((cursor) =>
        this.request<IPolitician[]>(
          "GET",
          `/politician?partyId=${partyId}&limit=${CURSOR_BATCH_LIMIT}${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ""}`,
        ),
      );
    } catch (error) {
      console.error("Error fetching politicians by party:", error);
      throw error;
    }
  }

  async getGovernmentLevels(): Promise<ApiResponse<IGovernmentLevel[]>> {
    return this.fetchAllCursorPages<IGovernmentLevel>((cursor) =>
      this.request<IGovernmentLevel[]>(
        "GET",
        `/level?limit=${CURSOR_BATCH_LIMIT}${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ""}`,
      ),
    );
  }

  async getPositions(): Promise<ApiResponse<IPosition[]>> {
    return this.fetchAllCursorPages<IPosition>((cursor) =>
      this.request<IPosition[]>(
        "GET",
        `/position?limit=${CURSOR_BATCH_LIMIT}${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ""}`,
      ),
    );
  }

  async getParties(): Promise<ApiResponse<IParty[]>> {
    return this.fetchAllCursorPages<IParty>((cursor) =>
      this.request<IParty[]>(
        "GET",
        `/party?limit=${CURSOR_BATCH_LIMIT}${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ""}`,
      ),
    );
  }

  async ratePolitician(
    _id: string,
    _rating: number,
  ): Promise<ApiResponse<void>> {
    return unsupportedRoute("Politician rating");
  }

  // Location APIs
  async getAllProvinces(): Promise<ApiData<IProvince[]>> {
    const response = await this.fetchAllCursorPages<IProvince>((cursor) =>
      this.request<IProvince[]>(
        "GET",
        `/province?limit=${CURSOR_BATCH_LIMIT}${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ""}`,
      ),
    );

    return toApiData(response);
  }

  async getDistrictsByProvinceId(
    provinceId: string,
  ): Promise<ApiData<IDistrict[]>> {
    const response = await this.fetchAllCursorPages<IDistrict>((cursor) =>
      this.request<IDistrict[]>(
        "GET",
        `/district/province/${provinceId}?limit=${CURSOR_BATCH_LIMIT}${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ""}`,
      ),
    );

    return toApiData(response);
  }

  async getConstituencyByWardId(
    wardId: string,
  ): Promise<ApiResponse<IConstituency>> {
    return this.request<IConstituency>("GET", `/constituency/ward/${wardId}`);
  }

  async getMunicipalitiesByDistrictId(
    districtId: string,
  ): Promise<ApiData<IMunicipality[]>> {
    const response = await this.fetchAllCursorPages<IMunicipality>((cursor) =>
      this.request<IMunicipality[]>(
        "GET",
        `/municipality/district/${districtId}?limit=${CURSOR_BATCH_LIMIT}${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ""}`,
      ),
    );
    return toApiData(response);
  }

  async getWardsByMunicipalityId(
    municipalityId: string,
  ): Promise<ApiData<IWard[]>> {
    const response = await this.fetchAllCursorPages<IWard>((cursor) =>
      this.request<IWard[]>(
        "GET",
        `/ward/municipality/${municipalityId}?limit=${CURSOR_BATCH_LIMIT}${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ""}`,
      ),
    );
    return toApiData(response);
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

  async getAllReports(): Promise<ApiResponse<IReport[]>> {
    return this.fetchAllCursorPages<IReport>((cursor) =>
      this.request<IReport[]>("POST", `/report/filter`, {
        ...(cursor ? { cursor } : {}),
        limit: CURSOR_BATCH_LIMIT,
      }),
    );
  }

  async getReportById(id: string): Promise<ApiResponse<IReport>> {
    return this.request<IReport>("GET", `/report/${id}`);
  }

  async updateReport(
    id: string,
    data: Partial<ReportCreateData>,
  ): Promise<ApiResponse<IReport>> {
    return this.request<IReport>("PUT", `/report/${id}`, data);
  }

  async getUserReports(): Promise<ApiResponse<IReport[]>> {
    return this.request<IReport[]>("GET", "/report/my-reports");
  }

  async updateReportStatus(
    _id: string,
    _data: ReportUpdateData,
  ): Promise<ApiResponse<IReport>> {
    return unsupportedRoute("Citizen report status updates");
  }

  async voteOnReport(
    id: string,
    direction: "up" | "down",
  ): Promise<ApiResponse<IReport>> {
    return this.request<IReport>("PUT", `/report/${id}/vote`, { direction });
  }

  async shareReport(id: string): Promise<ApiResponse<IReport>> {
    return this.request<IReport>("POST", `/report/${id}/share`);
  }

  async uploadEvidence(id: string, files: File[]): Promise<ApiResponse<void>> {
    const formData = new FormData();

    files.forEach((file) => {
      formData.append("files", file);
    });

    return this.request<void>("POST", `/report-evidence/${id}`, formData);
  }

  async deleteEvidence(
    reportId: string,
    evidenceId: string,
    cloudinaryPublicId: string,
  ): Promise<ApiResponse<void>> {
    return this.request<void>(
      "DELETE",
      `/report-evidence/${reportId}/${evidenceId}`,
      {
        cloudinaryPublicId,
      },
    );
  }

  // Polling APIs
  async createPoll(data: CreatePollData): Promise<ApiResponse<Poll>> {
    return this.request<Poll>("POST", "/poll", data);
    // ... (rest of the code remains the same)
  }

  async getAllPolls(filters?: PollFilters): Promise<Poll[]> {
    const serializeFilters = (cursor?: string | null) => {
      const params = new URLSearchParams();

      Object.entries(filters || {}).forEach(([key, value]) => {
        if (value) {
          params.set(key, JSON.stringify(value));
        }
      });

      params.set("limit", String(CURSOR_BATCH_LIMIT));

      if (cursor) {
        params.set("cursor", cursor);
      }

      return params.toString();
    };

    const response = await this.fetchAllCursorPages<any>((cursor) =>
      this.request<any[]>("GET", `/poll?${serializeFilters(cursor)}`),
    );

    return response.data || [];
  }

  async getPollById(id: string): Promise<ApiResponse<Poll>> {
    return this.request<Poll>("GET", `/poll/${id}`);
  }

  async getUserPolls(): Promise<ApiResponse<Poll[]>> {
    const polls = await this.getAllPolls();
    return {
      success: true,
      data: polls.filter((poll) =>
        poll.options.some((option) => option.isVoted),
      ),
    };
  }

  async updatePoll(
    _id: string,
    _data: UpdatePollData,
  ): Promise<ApiResponse<Poll>> {
    return unsupportedRoute("Poll updates");
  }

  async deletePoll(_id: string): Promise<ApiResponse<void>> {
    return unsupportedRoute("Poll deletion");
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
    void data;
    return unsupportedRoute("Campaign voter registration");
  }

  async getVoterRegistrations(params?: {
    constituencyId?: number;
    userId?: number;
  }): Promise<ApiResponse<any[]>> {
    void params;
    return unsupportedRoute("Campaign voter registrations");
  }

  async verifyVoterRegistration(
    id: number,
    data: {
      status: "verified" | "rejected";
      notes?: string;
    },
  ): Promise<ApiResponse<any>> {
    void id;
    void data;
    return unsupportedRoute("Campaign voter registration verification");
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
    void data;
    return unsupportedRoute("Campaign voter survey");
  }

  async getVoterSurveys(params?: {
    constituencyId?: number;
    userId?: number;
  }): Promise<ApiResponse<any[]>> {
    void params;
    return unsupportedRoute("Campaign voter surveys");
  }

  async getCandidatesByConstituency(
    constituencyId: number,
    electionType: string,
  ): Promise<ApiResponse<any[]>> {
    void constituencyId;
    void electionType;
    return unsupportedRoute("Campaign candidates by constituency");
  }

  async compareCandidatesCampaign(
    candidate1Id: number,
    candidate2Id: number,
    userId: number,
  ): Promise<ApiResponse<any>> {
    void candidate1Id;
    void candidate2Id;
    void userId;
    return unsupportedRoute("Campaign candidate comparison");
  }

  async getActiveVotingSessions(): Promise<ApiResponse<any[]>> {
    return unsupportedRoute("Campaign voting sessions");
  }

  async castVote(data: {
    sessionId: number;
    candidateId: number;
    userId: number;
  }): Promise<ApiResponse<any>> {
    void data;
    return unsupportedRoute("Campaign voting");
  }

  async getVotingResults(sessionId: number): Promise<ApiResponse<any>> {
    void sessionId;
    return unsupportedRoute("Campaign voting results");
  }

  async getCampaignAnalytics(params?: {
    constituencyId?: number;
    startDate?: string;
    endDate?: string;
  }): Promise<ApiResponse<any>> {
    void params;
    return unsupportedRoute("Campaign analytics");
  }

  async getCampaignDashboard(): Promise<ApiResponse<any>> {
    return unsupportedRoute("Campaign dashboard");
  }

  // Viral APIs
  async generateShareContent(
    data: any,
    userId: string,
  ): Promise<ApiResponse<any>> {
    void data;
    void userId;
    return unsupportedRoute("Viral share content");
  }

  async trackShare(
    itemId: string,
    itemType: string,
    platform: string,
    userId: string,
  ): Promise<void> {
    void itemId;
    void itemType;
    void platform;
    void userId;
    return unsupportedRoute("Viral share tracking");
  }

  async getBadges(params?: { userId?: string }): Promise<ApiResponse<any[]>> {
    void params;
    return unsupportedRoute("Viral badges");
  }

  async unlockBadge(badgeId: string): Promise<ApiResponse<any>> {
    void badgeId;
    return unsupportedRoute("Viral badge unlocks");
  }

  async getLeaderboard(
    type: string,
    period: string,
  ): Promise<ApiResponse<any[]>> {
    void type;
    void period;
    return unsupportedRoute("Viral leaderboard");
  }

  async getTrendingPolls(limit: number = 10): Promise<ApiResponse<any[]>> {
    void limit;
    return unsupportedRoute("Viral trending polls");
  }

  async voteOnPollViral(
    pollId: string,
    optionId: string,
    userId: string,
  ): Promise<ApiResponse<any>> {
    void pollId;
    void optionId;
    void userId;
    return unsupportedRoute("Viral poll voting");
  }

  async getTransparencyFeed(
    limit: number = 20,
    cursor?: string | null,
  ): Promise<ApiResponse<any[]>> {
    void limit;
    void cursor;
    return unsupportedRoute("Viral transparency feed");
  }

  async reactToFeed(
    itemId: string,
    itemType: string,
    reaction: string,
    userId: string,
  ): Promise<void> {
    void itemId;
    void itemType;
    void reaction;
    void userId;
    return unsupportedRoute("Viral feed reactions");
  }

  async getStreaks(params?: { userId?: string }): Promise<ApiResponse<any>> {
    void params;
    return unsupportedRoute("Viral streaks");
  }

  async recordActivity(activity: string, userId: string): Promise<void> {
    void activity;
    void userId;
    return unsupportedRoute("Viral activity tracking");
  }

  async getComments(
    itemId: string,
    itemType: string,
  ): Promise<ApiResponse<any[]>> {
    void itemId;
    void itemType;
    return unsupportedRoute("Viral comments");
  }

  async addComment(
    itemId: string,
    itemType: string,
    content: string,
    userId: string,
  ): Promise<ApiResponse<any>> {
    void itemId;
    void itemType;
    void content;
    void userId;
    return unsupportedRoute("Viral comments");
  }

  async replyToComment(
    commentId: string,
    content: string,
    userId: string,
  ): Promise<ApiResponse<any>> {
    void commentId;
    void content;
    void userId;
    return unsupportedRoute("Viral comment replies");
  }

  async voteOnComment(
    commentId: string,
    vote: "up" | "down",
    userId: string,
  ): Promise<void> {
    void commentId;
    void vote;
    void userId;
    return unsupportedRoute("Viral comment votes");
  }

  async reportComment(
    commentId: string,
    reason: string,
    userId: string,
  ): Promise<void> {
    void commentId;
    void reason;
    void userId;
    return unsupportedRoute("Viral comment reports");
  }

  async getVerificationStatus(
    itemId: string,
    itemType: string,
  ): Promise<ApiResponse<any>> {
    void itemId;
    void itemType;
    return unsupportedRoute("Viral verification status");
  }

  async voteOnVerification(
    itemId: string,
    itemType: string,
    vote: "verify" | "reject",
    userId: string,
  ): Promise<void> {
    void itemId;
    void itemType;
    void vote;
    void userId;
    return unsupportedRoute("Viral verification voting");
  }

  async getInviteStats(userId: string): Promise<ApiResponse<any>> {
    void userId;
    return unsupportedRoute("Viral invite stats");
  }

  async trackInvite(inviterId: string, inviteeId: string): Promise<void> {
    void inviterId;
    void inviteeId;
    return unsupportedRoute("Viral invite tracking");
  }

  async getElectionData(): Promise<ApiResponse<any>> {
    return unsupportedRoute("Viral election data");
  }

  async getCandidates(params?: {
    constituencyId?: string;
    electionType?: string;
  }): Promise<ApiResponse<any[]>> {
    void params;
    return unsupportedRoute("Viral candidates");
  }

  async compareCandidatesViral(
    candidate1Id: string,
    candidate2Id: string,
  ): Promise<ApiResponse<any>> {
    void candidate1Id;
    void candidate2Id;
    return unsupportedRoute("Viral candidate comparison");
  }

  async getViralMetrics(): Promise<ApiResponse<any>> {
    return unsupportedRoute("Viral metrics");
  }

  async getUpdates(callbacks: Array<(updates: any) => void>): Promise<void> {
    void callbacks;
    return unsupportedRoute("Viral updates");
  }
}

export const apiService = new ApiService();
