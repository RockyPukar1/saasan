import { EmailTemplate } from '../interfaces/email.interface';
import { BaseEmailTemplate } from './base.template';

export class PoliticianAccountTemplate extends BaseEmailTemplate {
  generateAccountCreation(data: {
    politicianName: string;
    email: string;
    password: string;
  }): EmailTemplate {
    const content = `
      <h2 style="color: #333; margin-bottom: 20px;">Welcome to SaaSAN, ${data.politicianName}!</h2>
      
      <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
        Your politician account has been successfully created. You can now log in to manage your profile, 
        respond to reports, and engage with your constituents.
      </p>
      
      <div style="background: white; padding: 25px; border-radius: 8px; border-left: 4px solid #667eea; margin: 25px 0;">
        <h3 style="color: #333; margin-top: 0; margin-bottom: 15px;">Your Login Credentials:</h3>
        
        <div style="margin-bottom: 15px;">
          <strong style="color: #666;">Email:</strong>
          <span style="color: #333; margin-left: 10px;">${data.email}</span>
        </div>
        
        <div style="margin-bottom: 20px;">
          <strong style="color: #666;">Password:</strong>
          <span style="color: #333; margin-left: 10px; font-family: monospace; background: #f0f0f0; padding: 4px 8px; border-radius: 4px;">${data.password}</span>
        </div>
        
        <div style="background: #fff3cd; padding: 15px; border-radius: 6px; border: 1px solid #ffeaa7;">
          <p style="color: #856404; margin: 0; font-size: 14px;">
            <strong>Security Notice:</strong> Please change your password after first login for security.
          </p>
        </div>
      </div>
    `;

    return {
      subject: 'Your SaaSAN Politician Account Has Been Created',
      html: this.wrapInLayout(content),
    };
  }
}
