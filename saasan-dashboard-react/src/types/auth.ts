import type { IUser } from "./user";

export interface NestedPermissions {
  [key: string]: boolean | NestedPermissions;
}

export interface AuthPayload {
  user: IUser;
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
  user: IUser;
  profile?: Record<string, unknown>;
  permissions: string[];
  nestedPermissions: NestedPermissions;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}
