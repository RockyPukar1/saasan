import { IsMongoId } from 'class-validator';

export class PoliticianAnnouncementIdDto {
  @IsMongoId()
  announcementId: string;
}
