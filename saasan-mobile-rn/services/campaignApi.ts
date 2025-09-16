import { apiService } from './api';
import { formatApiResponse } from '../lib/bilingual';

export interface VoterRegistration {
  id: number;
  userId: number;
  constituencyId: number;
  wardId: number;
  registrationNumber: string;
  registrationDate: string;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  verificationNotes?: string;
}

export interface VoterIntentSurvey {
  id: number;
  userId: number;
  constituencyId: number;
  returnIntent: 'returning' | 'unsure' | 'cannot';
  returnReason?: string;
  votingIntent?: 'will_vote' | 'might_vote' | 'will_not_vote';
  preferredCandidateId?: number;
  concerns?: string[];
  suggestions?: string;
  surveyDate: string;
}

export interface ElectionCandidate {
  id: number;
  politicianId: number;
  fullName: string;
  fullNameNepali?: string;
  photoUrl?: string;
  age?: number;
  party: {
    id: number;
    name: string;
    nameNepali?: string;
    logoUrl?: string;
  };
  constituency: {
    id: number;
    name: string;
    nameNepali?: string;
  };
  candidateNumber?: number;
  symbol?: string;
  symbolNepali?: string;
  manifesto?: string;
  manifestoNepali?: string;
  keyPromises?: string[];
  keyPromisesNepali?: string[];
  educationBackground?: string;
  educationBackgroundNepali?: string;
  professionalExperience?: string;
  professionalExperienceNepali?: string;
  criminalRecords?: any;
  assetDeclaration?: any;
  voteCount: number;
  isActive: boolean;
}

export interface VotingSession {
  id: number;
  electionType: 'federal' | 'provincial';
  electionYear: number;
  constituencyId: number;
  sessionName: string;
  sessionNameNepali?: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  totalEligibleVoters?: number;
  totalVotesCast: number;
  resultsPublished: boolean;
}

export interface CampaignAnalytics {
  totalRegistrations: number;
  totalSurveys: number;
  returnIntentBreakdown: {
    returning: number;
    unsure: number;
    cannot: number;
  };
  votingIntentBreakdown: {
    will_vote: number;
    might_vote: number;
    will_not_vote: number;
  };
  constituencyStats: Array<{
    constituencyId: number;
    constituencyName: string;
    constituencyNameNepali?: string;
    registrations: number;
    surveys: number;
    returnIntent: any;
    votingIntent: any;
  }>;
}

export interface CampaignDashboard {
  analytics: CampaignAnalytics;
  recentRegistrations: VoterRegistration[];
  recentSurveys: VoterIntentSurvey[];
  campaignMessage: {
    title: string;
    description: string;
  };
}

export interface VotingResults {
  sessionId: number;
  totalVotes: number;
  candidates: Array<{
    id: number;
    candidateNumber?: number;
    fullName: string;
    fullNameNepali?: string;
    photoUrl?: string;
    party: {
      name: string;
      nameNepali?: string;
      logoUrl?: string;
    };
    voteCount: number;
    votePercentage: number;
  }>;
}

class CampaignApiService {
  private baseUrl = '/api/v1/campaign';

  // Voter Registration
  async registerVoter(data: {
    userId: number;
    constituencyId: number;
    wardId: number;
    registrationNumber: string;
  }): Promise<VoterRegistration> {
    const response = await apiService.request('POST', `${this.baseUrl}/register-voter`, data);
    return formatApiResponse(response.data);
  }

  async getVoterRegistrations(params?: {
    constituencyId?: number;
    userId?: number;
  }): Promise<VoterRegistration[]> {
    const queryParams = new URLSearchParams();
    if (params?.constituencyId) queryParams.append('constituencyId', params.constituencyId.toString());
    if (params?.userId) queryParams.append('userId', params.userId.toString());
    
    const response = await apiService.request('GET', `${this.baseUrl}/voter-registrations?${queryParams.toString()}`);
    return formatApiResponse(response.data);
  }

  async verifyVoterRegistration(id: number, data: {
    status: 'verified' | 'rejected';
    notes?: string;
  }): Promise<VoterRegistration> {
    const response = await apiService.request('PUT', `${this.baseUrl}/voter-registrations/${id}/verify`, data);
    return formatApiResponse(response.data);
  }

  // Voter Intent Survey
  async submitVoterSurvey(data: {
    userId: number;
    constituencyId: number;
    returnIntent: 'returning' | 'unsure' | 'cannot';
    returnReason?: string;
    votingIntent?: 'will_vote' | 'might_vote' | 'will_not_vote';
    preferredCandidateId?: number;
    concerns?: string[];
    suggestions?: string;
  }): Promise<VoterIntentSurvey> {
    const response = await apiService.request('POST', `${this.baseUrl}/voter-survey`, data);
    return formatApiResponse(response.data);
  }

  async getVoterSurveys(params?: {
    constituencyId?: number;
    userId?: number;
  }): Promise<VoterIntentSurvey[]> {
    const queryParams = new URLSearchParams();
    if (params?.constituencyId) queryParams.append('constituencyId', params.constituencyId.toString());
    if (params?.userId) queryParams.append('userId', params.userId.toString());
    
    const response = await apiService.request('GET', `${this.baseUrl}/voter-surveys?${queryParams.toString()}`);
    return formatApiResponse(response.data);
  }

  // Election Candidates
  async getCandidatesByConstituency(
    constituencyId: number, 
    electionType: 'federal' | 'provincial' = 'federal'
  ): Promise<ElectionCandidate[]> {
    const response = await apiService.request('GET', `${this.baseUrl}/candidates/constituency/${constituencyId}?electionType=${electionType}`);
    return formatApiResponse(response.data);
  }

  async compareCandidates(candidate1Id: number, candidate2Id: number, userId: number): Promise<{
    candidate1: ElectionCandidate;
    candidate2: ElectionCandidate;
  }> {
    const response = await apiService.request('GET', `${this.baseUrl}/candidates/compare/${candidate1Id}/${candidate2Id}`, null, { userId });
    return formatApiResponse(response.data);
  }

  // Voting System
  async getActiveVotingSessions(): Promise<VotingSession[]> {
    const response = await apiService.request('GET', `${this.baseUrl}/voting-sessions/active`);
    return formatApiResponse(response.data);
  }

  async castVote(data: {
    userId: number;
    votingSessionId: number;
    candidateId: number;
  }): Promise<any> {
    const response = await apiService.request('POST', `${this.baseUrl}/vote`, data);
    return formatApiResponse(response.data);
  }

  async getVotingResults(sessionId: number): Promise<VotingResults> {
    const response = await apiService.request('GET', `${this.baseUrl}/voting-results/${sessionId}`);
    return formatApiResponse(response.data);
  }

  // Campaign Analytics
  async getCampaignAnalytics(constituencyId?: number): Promise<CampaignAnalytics> {
    const queryParams = constituencyId ? `?constituencyId=${constituencyId}` : '';
    const response = await apiService.request('GET', `${this.baseUrl}/analytics${queryParams}`);
    return formatApiResponse(response.data);
  }

  async getCampaignDashboard(): Promise<CampaignDashboard> {
    const response = await apiService.request('GET', `${this.baseUrl}/dashboard`);
    return formatApiResponse(response.data);
  }
}

export const campaignApi = new CampaignApiService();
