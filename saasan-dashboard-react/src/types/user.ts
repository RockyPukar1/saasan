export const UserRole = {
  ADMIN: 'admin',
  POLITICIAN: 'politician',
  CITIZEN: 'citizen',
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export interface IUser {
  id: string;
  email: string;
  phone?: string | null;
  password_hash?: string;
  full_name: string;
  district?: string | null;
  municipality?: string | null;
  ward_number?: number | null;
  role: UserRole;
  last_active_at: Date | string;
  created_at: Date | string;
  updated_at: Date | string;
}