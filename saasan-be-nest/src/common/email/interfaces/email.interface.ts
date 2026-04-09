export interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
  cc?: string | string[];
  bcc?: string | string[];
  attachments?: any[];
}

export interface EmailTemplate {
  subject: string;
  html: string;
}
