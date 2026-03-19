export interface IPollFilters {
  status?: string;
  category?: string;
  district?: string;
  municipality?: string;
  ward?: string;
  search?: string;
  limit?: number;
  offset?: number;
  politician_id?: string;
  party_id?: string;
}

export interface ICreatePollData {
  title: string;
  title_nepali?: string;
  description: string;
  description_nepali?: string;
  type: string;
  type_nepali?: string;
  options: string[];
  options_nepali?: string[];
  category: string;
  category_nepali?: string;
  status: string;
  status_nepali?: string;
  end_date: string;
  is_anonymous: boolean;
  requires_verification: boolean;
}

export interface IUpdatePollData {
  title?: string;
  title_nepali?: string;
  description?: string;
  description_nepali?: string;
  status?: string;
  status_nepali?: string;
  end_date?: string;
  is_anonymous?: boolean;
  requires_verification?: boolean;
}

export interface IPollAnalytics {
  total_polls: number;
  active_polls: number;
  total_votes: number;
  participation_rate: number;
  category_breakdown: { category: string; count: number; percentage: number }[];
  district_breakdown: { district: string; count: number; percentage: number }[];
  politician_performance: {
    politician_id: string;
    politician_name: string;
    polls_created: number;
    total_votes_received: number;
    average_rating: number;
  }[];
  party_performance: {
    party_id: string;
    party_name: string;
    polls_created: number;
    total_votes_received: number;
    average_rating: number;
  }[];
}

export interface IPollComparison {
  poll_id: string;
  poll_title: string;
  politician_comparison: {
    politician_id: string;
    politician_name: string;
    votes_received: number;
    percentage: number;
  }[];
  party_comparison: {
    party_id: string;
    party_name: string;
    votes_received: number;
    percentage: number;
  }[];
}


export interface IPollOption {
  id: string;
  text: string;
  disabled: boolean;
  isVoted: boolean;
  voteCount: number;
  percentage: number;
}
export interface IPoll {
  id: string;
  title: string;
  description: string;
  type: string;
  status: string;
  category: string;
  startDate: string;
  endDate?: string;
  createdBy?: string;
  totalVotes: number;
  requiresVerification: boolean;
  options: IPollOption[];
  createdAt: string;
  updatedAt: string;
}

export interface IPollVote {
  id?: string;
  poll_id: string;
  option_id: string | string[];
  user_id: string;
  created_at: string;
  updated_at?: string;
}