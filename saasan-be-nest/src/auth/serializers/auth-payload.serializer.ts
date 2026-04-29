import { Expose } from 'class-transformer';
import { UserProfilePayloadSerializer } from 'src/user/serializers/user.serializer';

export class AuthPayloadSerializer extends UserProfilePayloadSerializer {
  @Expose() accessToken: string;
  @Expose() refreshToken: string;
  @Expose() sessionId?: string;
  @Expose() accessTokenExpiresIn?: number;
  @Expose() refreshTokenExpiresIn?: Date;
}
