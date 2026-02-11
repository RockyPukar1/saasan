import { Expose } from 'class-transformer';

export class SocialMediaSerializer {
  @Expose() facebook: string;
  @Expose() twitter: string;
  @Expose() instagram: string;
}
