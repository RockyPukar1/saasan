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
  avatarUrl?: string;
  designation?: string;
  department?: string;
  politicianId?: string;
  provinceId?: string;
  districtId?: string;
  municipalityId?: string;
  wardId?: string;
  constituencyId?: string;
  district?: string;
  municipality?: string;
  wardNumber?: number;
  ward_number?: number;
  isActive?: boolean;
  isVerified?: boolean;
  profile?: Record<string, unknown>;
  lastActiveAt?: string;
  last_active_at?: string;
  createdAt?: string;
  created_at?: string;
  updatedAt?: string;
  updated_at?: string;
}

export interface AuthPayload {
  user: UserProfile;
  profile?: Record<string, unknown>;
  permissions: string[];
  nestedPermissions: NestedPermissions;
  accessToken: string;
  refreshToken: string;
  sessionId?: string;
  accessTokenExpiresIn?: number;
  refreshTokenExpiresIn?: string | Date;
}

export interface ProfilePayload {
  user: UserProfile;
  profile?: Record<string, unknown>;
  permissions: string[];
  nestedPermissions: NestedPermissions;
}

export interface AuthSession {
  id: string;
  refreshExpiresAt: string;
  revokedAt?: string;
  revokedReason?: string;
  lastUsedAt?: string;
  ipAddress?: string;
  userAgent?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
