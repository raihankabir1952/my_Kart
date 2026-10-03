import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private readonly resend: Resend;

  constructor() {
    this.resend = new Resend(
      process.env.RESEND_API_KEY,
    );
  }

  async sendPasswordResetEmail(
    email: string,
    resetToken: string,
  ) {
    const frontendUrl =
      process.env.FRONTEND_URL ||
      'http://localhost:3000';

    const resetLink =
      `${frontendUrl}/reset-password?token=${resetToken}`;

    const { data, error } =
      await this.resend.emails.send({
        from: 'My-Kart <onboarding@resend.dev>',
        to: email,
        subject: 'Reset Your My-Kart Password',
        html: `
          <div
            style="
              font-family: Arial, sans-serif;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            "
          >
            <h2>Reset Your Password</h2>

            <p>
              We received a request to reset your
              My-Kart password.
            </p>

            <p>
              Click the button below to create a new
              password.
            </p>

            <a
              href="${resetLink}"
              style="
                display: inline-block;
                padding: 12px 20px;
                background: #ea580c;
                color: white;
                text-decoration: none;
                border-radius: 6px;
              "
            >
              Reset Password
            </a>

            <p style="margin-top: 20px;">
              This link will expire in 15 minutes.
            </p>

            <p>
              If you did not request a password reset,
              you can safely ignore this email.
            </p>

            <p
              style="
                margin-top: 30px;
                font-size: 12px;
                color: #777;
              "
            >
              My-Kart
            </p>
          </div>
        `,
      });

    // Temporary debugging
    console.log('RESEND DATA:', data);
    console.log('RESEND ERROR:', error);

    if (error) {
      throw new Error(
        `Failed to send password reset email: ${error.message}`,
      );
    }

    return data;
  }
}
