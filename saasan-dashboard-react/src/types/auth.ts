import type { IUser } from "./user";

export interface NestedPermissions {
  [key: string]: boolean | NestedPermissions;
}

export interface AuthPayload {
  user: IUser;
  permissions: string[];
  nestedPermissions: NestedPermissions;
  accessToken: string;
  refreshToken: string;
  sessionId?: string;
  accessTokenExpiresIn?: number;
  refreshTokenExpiresAt?: string;
}

export interface ProfilePayload {
  user: IUser;
  permissions: string[];
  nestedPermissions: NestedPermissions;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}
