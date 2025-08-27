export enum PollStatus {
  ACTIVE = "active",
  ENDED = "ended",
  DRAFT = "draft",
}

export enum PollType {
  SINGLE_CHOICE = "single_choice",
  MULTIPLE_CHOICE = "multiple_choice",
  RATING = "rating",
}

export interface PollOption {
  id: string;
  text: string;
  votes_count: number;
  percentage?: number;
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
  user_vote?: string | string[]; // Option ID(s) that the user voted for
  is_anonymous: boolean;
  requires_verification: boolean;
  district?: string;
  municipality?: string;
  ward?: string;
}

export interface PollVote {
  poll_id: string;
  option_id: string | string[]; // Array for multiple choice polls
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
}

export interface CreatePollData {
  title: string;
  description: string;
  type: PollType;
  options: { text: string }[];
  category: string;
  end_date: string;
  is_anonymous: boolean;
  requires_verification: boolean;
  district?: string;
  municipality?: string;
  ward?: string;
}

export interface UpdatePollData {
  title?: string;
  description?: string;
  status?: PollStatus;
  end_date?: string;
  is_anonymous?: boolean;
  requires_verification?: boolean;
}
