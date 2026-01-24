import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST'),
      port: this.configService.get<number>('SMTP_PORT') || 587,
      secure: this.configService.get<string>('SMTP_SECURE') === 'true',
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASS'),
      },
    });
  }

  private async sendEmail(to: string, subject: string, html: string) {
    try {
      await this.transporter.sendMail({
        from: `"Vivah Matrimony" <${this.configService.get<string>('SMTP_FROM') || 'noreply@vivahmatrimony.com'}>`,
        to,
        subject,
        html,
      });
      this.logger.log(`Email sent to ${to}: ${subject}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}`, error);
    }
  }

  async sendVerificationEmail(email: string, token: string) {
    const verifyUrl = `${this.configService.get<string>('FRONTEND_URL')}/verify-email?token=${token}`;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #8B0000, #DAA520); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .header h1 { color: white; margin: 0; font-size: 28px; }
          .content { background: #fff; padding: 30px; border: 1px solid #eee; }
          .button { display: inline-block; background: linear-gradient(135deg, #8B0000, #B22222); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎊 Vivah Matrimony</h1>
          </div>
          <div class="content">
            <h2>Welcome to Vivah Matrimony!</h2>
            <p>Thank you for registering with us. Please verify your email address to complete your registration and start your journey to find your perfect life partner.</p>
            <p style="text-align: center;">
              <a href="${verifyUrl}" class="button">Verify Email Address</a>
            </p>
            <p>If you didn't create an account, you can safely ignore this email.</p>
            <p>This link will expire in 24 hours.</p>
          </div>
          <div class="footer">
            <p>© 2024 Vivah Matrimony. All rights reserved.</p>
            <p>Finding your perfect match for a lifetime of happiness.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await this.sendEmail(email, 'Verify Your Email - Vivah Matrimony', html);
  }

  async sendPasswordResetEmail(email: string, token: string) {
    const resetUrl = `${this.configService.get<string>('FRONTEND_URL')}/reset-password?token=${token}`;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #8B0000, #DAA520); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .header h1 { color: white; margin: 0; }
          .content { background: #fff; padding: 30px; border: 1px solid #eee; }
          .button { display: inline-block; background: linear-gradient(135deg, #8B0000, #B22222); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Password Reset</h1>
          </div>
          <div class="content">
            <h2>Reset Your Password</h2>
            <p>We received a request to reset your password. Click the button below to create a new password:</p>
            <p style="text-align: center;">
              <a href="${resetUrl}" class="button">Reset Password</a>
            </p>
            <p>If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
            <p>This link will expire in 1 hour.</p>
          </div>
          <div class="footer">
            <p>© 2024 Vivah Matrimony. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await this.sendEmail(email, 'Reset Your Password - Vivah Matrimony', html);
  }

  async sendMeetingInvitation(
    email: string,
    userName: string,
    partnerName: string,
    meetingDate: Date,
    venue: string,
  ) {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #8B0000, #DAA520); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .header h1 { color: white; margin: 0; }
          .content { background: #fff; padding: 30px; border: 1px solid #eee; }
          .meeting-card { background: linear-gradient(135deg, #FFF8DC, #FFFACD); padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #DAA520; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>💑 Meeting Scheduled!</h1>
          </div>
          <div class="content">
            <h2>Dear ${userName},</h2>
            <p>Great news! A meeting has been arranged for you to meet <strong>${partnerName}</strong>.</p>
            
            <div class="meeting-card">
              <h3 style="margin-top: 0; color: #8B0000;">📅 Meeting Details</h3>
              <p><strong>Date & Time:</strong> ${meetingDate.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
              <p><strong>Venue:</strong> ${venue}</p>
            </div>
            
            <p>Please arrive on time and bring a valid ID for verification. We wish you all the best for this meeting!</p>
            
            <p>If you need to reschedule, please contact our support team.</p>
          </div>
          <div class="footer">
            <p>© 2024 Vivah Matrimony. All rights reserved.</p>
            <p>May this meeting be the beginning of a beautiful journey together! 🎊</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await this.sendEmail(email, `Meeting Scheduled with ${partnerName} - Vivah Matrimony`, html);
  }

  async sendInterestNotification(email: string, userName: string, senderName: string) {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #8B0000, #DAA520); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .header h1 { color: white; margin: 0; }
          .content { background: #fff; padding: 30px; border: 1px solid #eee; }
          .button { display: inline-block; background: linear-gradient(135deg, #8B0000, #B22222); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>💝 New Interest!</h1>
          </div>
          <div class="content">
            <h2>Dear ${userName},</h2>
            <p>Exciting news! <strong>${senderName}</strong> has expressed interest in your profile on Vivah Matrimony.</p>
            <p>Log in to your account to view their profile and respond to this interest.</p>
            <p style="text-align: center;">
              <a href="${this.configService.get<string>('FRONTEND_URL')}/dashboard/interests" class="button">View Interest</a>
            </p>
          </div>
          <div class="footer">
            <p>© 2024 Vivah Matrimony. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await this.sendEmail(email, `${senderName} is interested in you! - Vivah Matrimony`, html);
  }
}
