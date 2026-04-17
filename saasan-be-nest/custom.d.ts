import { UserRole } from 'src/user/entities/user.entity';

export {};

declare global {
  namespace Express {
    interface Request {
      user: {
        id: string;
        email: string;
        role: UserRole;
        sessionId?: string;
        permissions?: string[];
      };
    }
  }
}
