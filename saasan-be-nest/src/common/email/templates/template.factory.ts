import { PoliticianAccountTemplate } from './politician-account.template';

export class EmailTemplateFactory {
  private static politicianAccountTemplate = new PoliticianAccountTemplate();

  static createPoliticianAccountEmail(data: {
    politicianName: string;
    email: string;
    password: string;
  }) {
    return this.politicianAccountTemplate.generateAccountCreation(data);
  }

  // TODO: Add more template methods here
  // createPasswordResetEmail
  // createWelcomeEmail
}
