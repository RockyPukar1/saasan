import { Injectable, Logger } from '@nestjs/common';
import { AuthSessionRepository } from '../repositories/auth-session.repository';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class AuthSessionCleanupService {
  private readonly logger = new Logger(AuthSessionCleanupService.name);

  constructor(private readonly authSessionRepo: AuthSessionRepository) {}

  @Cron(CronExpression.EVERY_10_MINUTES)
  async revokeExpiredSessions() {
    const revokedCount = await this.authSessionRepo.revokeExpiredSessions();

    if (revokedCount > 0) {
      this.logger.log(`Revoked ${revokedCount} expired sessions`);
    }
  }
}
