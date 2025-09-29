import { UserRole } from "./index";

export { UserRole };

export interface User {
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

// Express types (for backend only)
export interface ExpressRequest {
  user: {
    userId: string;
    email: string;
    role: string;
  };
}
