import { Injectable } from '@nestjs/common';
import nodemailer from 'nodemailer';
import { EmailOptions } from '../interfaces/email.interface';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SAASAN_SMTP_HOST,
      port: Number(process.env.SAASAN_SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SAASAN_SMTP_USER,
        pass: process.env.SAASAN_SMTP_PASSWORD,
      },
    });
  }

  async sendEmail(options: EmailOptions) {
    const mailOptions = {
      from: options.from || process.env.SAASAN_SMTP_FROM,
      to: options.to,
      subject: options.subject,
      html: options.html,
      cc: options.cc,
      bcc: options.bcc,
      attachments: options.attachments,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
