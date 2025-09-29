import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import { User } from "../../../../shared/types/user";

export class AuthHelper {
  static generateToken(user: User): string {
    return jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );
  }

  static verifyToken(token: string): any {
    return jwt.verify(token, process.env.JWT_SECRET!);
  }

  static generateRefreshToken(userId: string): string {
    return jwt.sign(
      {
        userId,
        type: "refresh",
      },
      process.env.JWT_REFRESH_TOKEN!,
      { expiresIn: "30d" }
    );
  }

  static async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  static async comparePassword(
    password: string,
    hash: string
  ): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
