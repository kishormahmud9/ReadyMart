import nodemailer from 'nodemailer'

// Email configuration from environment variables
const EMAIL_CONFIG = {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER || 'your-email@gmail.com',
        pass: process.env.EMAIL_PASSWORD || 'your-app-password',
    },
}

const EMAIL_FROM = process.env.EMAIL_FROM || 'ReadyMart <noreply@readymart.com>'

// Create reusable transporter
const transporter = nodemailer.createTransport(EMAIL_CONFIG)

/**
 * Send email
 */
export async function sendEmail(
    to: string,
    subject: string,
    html: string
): Promise<{ success: boolean; error?: string }> {
    try {
        await transporter.sendMail({
            from: EMAIL_FROM,
            to,
            subject,
            html,
        })
        return { success: true }
    } catch (error) {
        console.error('Email sending failed:', error)
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
}

/**
 * Send verification email with OTP
 */
export async function sendVerificationEmail(email: string, otp: string): Promise<{ success: boolean; error?: string }> {
    const subject = 'Verify Your Email - ReadyMart'
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #1e3a8a 0%, #f97316 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
        .otp-box { background: white; border: 2px dashed #f97316; padding: 20px; text-align: center; margin: 20px 0; border-radius: 10px; }
        .otp { font-size: 32px; font-weight: bold; color: #1e3a8a; letter-spacing: 5px; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to ReadyMart!</h1>
        </div>
        <div class="content">
          <h2>Email Verification</h2>
          <p>Thank you for registering with ReadyMart. Please use the OTP below to verify your email address:</p>
          
          <div class="otp-box">
            <p style="margin: 0; color: #666;">Your OTP Code:</p>
            <div class="otp">${otp}</div>
          </div>
          
          <p><strong>This OTP will expire in 10 minutes.</strong></p>
          <p>If you didn't request this verification, please ignore this email.</p>
          
          <div class="footer">
            <p>© 2024 ReadyMart. All rights reserved.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `

    return sendEmail(email, subject, html)
}

/**
 * Send password reset email with OTP
 */
export async function sendPasswordResetEmail(email: string, otp: string): Promise<{ success: boolean; error?: string }> {
    const subject = 'Reset Your Password - ReadyMart'
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #dc2626 0%, #f97316 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
        .otp-box { background: white; border: 2px dashed #dc2626; padding: 20px; text-align: center; margin: 20px 0; border-radius: 10px; }
        .otp { font-size: 32px; font-weight: bold; color: #dc2626; letter-spacing: 5px; }
        .warning { background: #fef2f2; border-left: 4px solid #dc2626; padding: 15px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Password Reset Request</h1>
        </div>
        <div class="content">
          <h2>Reset Your Password</h2>
          <p>We received a request to reset your password. Please use the OTP below to proceed:</p>
          
          <div class="otp-box">
            <p style="margin: 0; color: #666;">Your OTP Code:</p>
            <div class="otp">${otp}</div>
          </div>
          
          <p><strong>This OTP will expire in 10 minutes.</strong></p>
          
          <div class="warning">
            <strong>⚠️ Security Notice:</strong><br>
            If you didn't request a password reset, please ignore this email and ensure your account is secure.
          </div>
          
          <div class="footer">
            <p>© 2024 ReadyMart. All rights reserved.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `

    return sendEmail(email, subject, html)
}

/**
 * Test email configuration
 */
export async function testEmailConnection(): Promise<boolean> {
    try {
        await transporter.verify()
        console.log('✅ Email server is ready to send emails')
        return true
    } catch (error) {
        console.error('❌ Email server connection failed:', error)
        return false
    }
}
