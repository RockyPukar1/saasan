import { Expose } from 'class-transformer';

export class ContactSerializer {
  @Expose() email: string;
  @Expose() phone: string;
  @Expose() website: string;
}
