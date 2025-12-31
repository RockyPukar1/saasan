import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export class AuthHelper {
  static generateToken(user): string {
    return jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.SAASAN_JWT_SECRET!,
      { expiresIn: '7d' },
    );
  }

  static verifyToken(token: string): any {
    return jwt.verify(token, process.env.SAASAN_JWT_SECRET!);
  }

  static generateRefreshToken(userId: string): string {
    return jwt.sign(
      {
        userId,
        type: 'refresh',
      },
      process.env.SAASAN_JWT_REFRESH_TOKEN!,
      { expiresIn: '30d' },
    );
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
