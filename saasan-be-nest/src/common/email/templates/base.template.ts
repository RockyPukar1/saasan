export abstract class BaseEmailTemplate {
  protected baseUrl: string;

  protected wrapInLayout(content: string) {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">SaaSAN</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Political Accountability Platform</p>
        </div>
        
        <div style="padding: 40px 30px; background: #f9f9f9;">
          ${content}
        </div>
        
        <div style="background: #333; color: white; padding: 20px; text-align: center;">
          <p style="margin: 0; font-size: 14px;">
            © 2024 SaaSAN. All rights reserved.<br>
            This is an automated message. Please do not reply to this email.
          </p>
        </div>
      </div>
    `;
  }
}
