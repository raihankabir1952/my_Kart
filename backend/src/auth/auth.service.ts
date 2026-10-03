import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

import { UsersService } from '../users/users.service';

import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

import { EmailService } from './email.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  // ----- REGISTER -----
  async register(dto: RegisterDto) {
    // Eki email diye ki age register kora ache?
    const existing =
      await this.usersService.findByEmail(dto.email);

    if (existing) {
      throw new ConflictException(
        'Email already in use',
      );
    }

    // Create user
    // Password automatically hash hobe UsersService e
    const user =
      await this.usersService.create(dto);

    return this.buildAuthResponse(user);
  }

  // ----- LOGIN -----
  async login(dto: LoginDto) {
    const user =
      await this.usersService.findByEmail(
        dto.email,
      );

    if (!user) {
      throw new UnauthorizedException(
        'Invalid credentials',
      );
    }

    // Password verify
    const match = await bcrypt.compare(
      dto.password,
      user.password,
    );

    if (!match) {
      throw new UnauthorizedException(
        'Invalid credentials',
      );
    }

    return this.buildAuthResponse(user);
  }

  // ----- FORGOT PASSWORD -----
  async forgotPassword(email: string) {
    console.log(
      'FORGOT PASSWORD CALLED:',
      email,
    );

    const user =
      await this.usersService.findByEmail(email);

    // Security:
    // Email exists kina reveal korbo na
    if (!user) {
      console.log('USER NOT FOUND');

      return {
        message:
          'If an account with that email exists, a password reset link has been requested.',
      };
    }

    console.log(
      'USER FOUND:',
      user.email,
    );

    // Secure random token
    const resetToken =
      crypto.randomBytes(32).toString('hex');

    // Token-er hash DB-te save korbo
    const resetTokenHash =
      crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    // Token 15 minutes valid
    const resetPasswordExpires =
      new Date(
        Date.now() + 15 * 60 * 1000,
      );

    user.resetPasswordTokenHash =
      resetTokenHash;

    user.resetPasswordExpires =
      resetPasswordExpires;

    await this.usersService.save(user);

    console.log('TOKEN SAVED');

    // Reset email send
    await this.emailService.sendPasswordResetEmail(
      user.email,
      resetToken,
    );

    console.log(
      'EMAIL SERVICE FINISHED',
    );

    return {
      message:
        'If an account with that email exists, a password reset link has been requested.',
    };
  }

  // ----- RESET PASSWORD -----
  async resetPassword(
    token: string,
    newPassword: string,
  ) {
    // Raw token-er hash তৈরি
    const tokenHash =
      crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');

    // DB-te matching hash খুঁজি
    const user =
      await this.usersService.findByResetTokenHash(
        tokenHash,
      );

    if (!user) {
      throw new UnauthorizedException(
        'Invalid or expired password reset token',
      );
    }

    // Token expiry check
    if (
      !user.resetPasswordExpires ||
      user.resetPasswordExpires.getTime() <
        Date.now()
    ) {
      throw new UnauthorizedException(
        'Invalid or expired password reset token',
      );
    }

    // New password hash
    user.password =
      await bcrypt.hash(
        newPassword,
        10,
      );

    // Token একবার use হওয়ার পর invalidate
    user.resetPasswordTokenHash = null;
    user.resetPasswordExpires = null;

    await this.usersService.save(user);

    return {
      message:
        'Password reset successfully. You can now login with your new password.',
    };
  }

  // ----- BUILD AUTH RESPONSE -----
  private buildAuthResponse(user: any) {
    const payload = {
      sub: user.id,
      email: user.email,
    };

    const token =
      this.jwtService.sign(payload);

    return {
      accessToken: token,

      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        role: user.role,
      },
    };
  }
}
