import type { UserRole } from 'src/user/entities/user.entity';

declare global {
  namespace Express {
    interface User {
      id: string;
      email: string;
      role: UserRole;
      politicianId?: string;
      sessionId?: string;
      permissions?: string[];
    }
  }
}

export {};
