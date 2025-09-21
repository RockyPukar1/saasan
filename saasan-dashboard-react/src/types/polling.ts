export const PollStatus = {
  ACTIVE: "active",
  ENDED: "ended",
  DRAFT: "draft",
} as const;

export const PollType = {
  SINGLE_CHOICE: "single_choice",
  MULTIPLE_CHOICE: "multiple_choice",
  RATING: "rating",
} as const;

export type PollStatus = (typeof PollStatus)[keyof typeof PollStatus];
export type PollType = (typeof PollType)[keyof typeof PollType];

export interface PollOption {
  id: string;
  text: string;
  votes_count: number;
  percentage: number;
}

export interface Poll {
  id: string;
  title: string;
  description: string;
  type: PollType;
  status: PollStatus;
  category: string;
  options: PollOption[];
  total_votes: number;
  start_date: string;
  end_date: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  user_vote?: string | string[];
  is_anonymous: boolean;
  requires_verification: boolean;
  district?: string;
  municipality?: string;
  ward?: string;
  politician_id?: string;
  party_id?: string;
}

export interface PollVote {
  poll_id: string;
  option_id: string | string[];
  user_id: string;
  created_at: string;
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
  category: string;
  category_nepali?: string;
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
