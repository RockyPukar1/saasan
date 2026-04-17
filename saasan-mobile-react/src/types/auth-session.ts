import type { UserRole } from "@/types";

export interface NestedPermissions {
  [key: string]: boolean | NestedPermissions;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName?: string;
  full_name?: string;
  role: UserRole | string;
  phone?: string;
  district?: string;
  municipality?: string;
  wardNumber?: number;
  ward_number?: number;
  lastActiveAt?: string;
  last_active_at?: string;
  createdAt?: string;
  created_at?: string;
  updatedAt?: string;
  updated_at?: string;
}

export interface AuthPayload {
  user: UserProfile;
  permissions: string[];
  nestedPermissions: NestedPermissions;
  accessToken: string;
  refreshToken: string;
  sessionId?: string;
  accessTokenExpiresIn?: number;
  refreshTokenExpiresAt?: string;
}

export interface ProfilePayload {
  user: UserProfile;
  permissions: string[];
  nestedPermissions: NestedPermissions;
}
