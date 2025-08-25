import jwt from "jsonwebtoken";

import { User } from "../../types";
import { ResponseHelper } from "./ResponseHelper";
import { Response } from "express";

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
}
