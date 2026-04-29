export const UserRole = {
  ADMIN: "admin",
  POLITICIAN: "politician",
  CITIZEN: "citizen",
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export interface IUser {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  isActive: boolean;
  isVerified: boolean;
  provinceId?: string;
  districtId?: string;
  municipalityId?: string;
  wardId?: string;
  constituencyId?: string;
  phone?: string;
  avatarUrl?: string;
  designation?: string;
  department?: string;
  politicianId?: string;
  profile?: Record<string, unknown>;
  lastActiveAt?: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;
}
