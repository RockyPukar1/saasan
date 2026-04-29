import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { UserIdDto } from 'src/user/dtos/user-id.dto';
import { SessionIdDto } from 'src/auth/dtos/session-id.dto';

export class AuthHelper {
  static generateToken(user): string {
    return jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
        politicianId: user.politicianId,
        sessionId: user.sessionId,
        type: 'access',
      },
      process.env.SAASAN_JWT_SECRET!,
      { expiresIn: '15m' },
    );
  }

  static verifyToken(token: string): any {
    return jwt.verify(token, process.env.SAASAN_JWT_SECRET!);
  }

  static generateRefreshToken({
    userId,
    sessionId,
  }: {
    userId: string;
    sessionId?: string;
  }) {
    return jwt.sign(
      {
        userId,
        sessionId,
        type: 'refresh',
      },
      process.env.SAASAN_JWT_REFRESH_TOKEN!,
      { expiresIn: '30d' },
    );
  }

  static verifyRefreshToken(token: string) {
    return jwt.verify(token, process.env.SAASAN_JWT_REFRESH_TOKEN!);
  }

  static getRefreshTokenExpiryDate() {
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 30);
    return expiry;
  }

  static hashToken(token: string) {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  static async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  static async comparePassword(
    password: string,
    hash: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
