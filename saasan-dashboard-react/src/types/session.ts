export interface IAuthSession {
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
