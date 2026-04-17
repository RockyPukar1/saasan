import type { UserDto } from "./api";

export interface NestedPermissions {
  [key: string]: boolean | NestedPermissions;
}

export interface AuthPayload {
  user: UserDto;
  permissions: string[];
  nestedPermissions: NestedPermissions;
  accessToken: string;
  refreshToken: string;
  sessionId?: string;
  accessTokenExpiresIn?: number;
  refreshTokenExpiresAt?: string;
}

export interface ProfilePayload {
  user: UserDto;
  permissions: string[];
  nestedPermissions: NestedPermissions;
}
