import { PollStatus, PollType, PollCategory } from "./index";

export { PollStatus, PollType, PollCategory };

export interface PollOption {
  id: string;
  poll_id?: string;
  text: string;
  text_nepali?: string;
  votes_count: number;
  percentage: number;
  created_at?: string;
  updated_at?: string;
}

export interface Poll {
  id: string;
  title: string;
  title_nepali?: string;
  description: string;
  description_nepali?: string;
  type: PollType;
  type_nepali?: string;
  status: PollStatus;
  status_nepali?: string;
  category: PollCategory;
  category_nepali?: string;
  start_date: string;
  end_date: string;
  created_by: string;
  total_votes: number;
  is_anonymous: boolean;
  requires_verification: boolean;
  options: PollOption[];
  created_at: string;
  updated_at: string;
  user_vote?: string | string[];
  district?: string;
  municipality?: string;
  ward?: string;
  politician_id?: string;
  party_id?: string;
}

export interface PollVote {
  id?: string;
  poll_id: string;
  option_id: string | string[];
  user_id: string;
  created_at: string;
  updated_at?: string;
}

export interface PollFilters {
  status?: PollStatus;
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

export interface CreatePollData {
  title: string;
  title_nepali?: string;
  description: string;
  description_nepali?: string;
  type: PollType;
  type_nepali?: string;
  options: string[];
  options_nepali?: string[];
  category: PollCategory;
  category_nepali?: string;
  status: PollStatus;
  status_nepali?: string;
  end_date: string;
  is_anonymous: boolean;
  requires_verification: boolean;
}

export interface UpdatePollData {
  title?: string;
  title_nepali?: string;
  description?: string;
  description_nepali?: string;
  status?: PollStatus;
  status_nepali?: string;
  end_date?: string;
  is_anonymous?: boolean;
  requires_verification?: boolean;
}

export interface PollAnalytics {
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

export interface PollComparison {
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
