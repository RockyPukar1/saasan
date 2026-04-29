import type { UserDto } from "./api";

export interface NestedPermissions {
  [key: string]: boolean | NestedPermissions;
}

export interface AuthPayload {
  user: UserDto;
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
  user: UserDto;
  profile?: Record<string, unknown>;
  permissions: string[];
  nestedPermissions: NestedPermissions;
}
