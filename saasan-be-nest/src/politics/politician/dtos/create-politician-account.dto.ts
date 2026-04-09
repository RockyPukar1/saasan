export class CreatePoliticianAccountDto {
  politicianId: string;
  password: string;
  accountCreatedAt?: Date;
  lastLoginAt?: Date;
}
